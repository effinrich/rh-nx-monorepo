package rhsp.opcofin;

import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JceOpenSSLPKCS8DecryptorProviderBuilder;
import org.bouncycastle.operator.InputDecryptorProvider;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.pkcs.PKCS8EncryptedPrivateKeyInfo;
import org.bouncycastle.pkcs.PKCSException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;

@Configuration
public class PkiConfig {

    @SuppressWarnings("unused")
    private final Logger logger = LoggerFactory.getLogger(PkiConfig.class);

    private final ResourceLoader resourceLoader;
    private final GetSecretValue getSecretValue;

    @Value("${snowflake.public}")
    private String snowflakePublicKeyPath;

    @Value("${snowflake.private}")
    private String snowflakePrivateKeyPath;

    @Value("${snowflake.passphrase}")
    private String snowflakePrivateKeyPassphrase;

    @Autowired
    public PkiConfig(ResourceLoader resourceLoader, GetSecretValue getSecretValue) {
        this.resourceLoader = resourceLoader;
        this.getSecretValue = getSecretValue;
    }

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    @Bean
    RSAPublicKey snowflakeApiPublicKey() throws IOException {
        var publicReader = new InputStreamReader(resourceLoader.getResource(snowflakePublicKeyPath).getInputStream());
        try (PEMParser pemParser = new PEMParser(publicReader)) {
            SubjectPublicKeyInfo subjectPublicKeyInfo = SubjectPublicKeyInfo.getInstance(pemParser.readObject());
            JcaPEMKeyConverter jcaPEMKeyConverter = new JcaPEMKeyConverter();
            return (RSAPublicKey) jcaPEMKeyConverter.getPublicKey(subjectPublicKeyInfo);
        }
    }

    @Bean
    RSAPrivateKey snowflakeApiPrivateKey() throws IOException, OperatorCreationException, PKCSException {
        var privateReader = resolvePrivateKeyPath();
        var privatePassphrase = resolvePrivateKeyPassphrase();
        try (PEMParser pemParser = new PEMParser(privateReader)) {
            PKCS8EncryptedPrivateKeyInfo encryptedPrivateKeyInfo = (PKCS8EncryptedPrivateKeyInfo) pemParser.readObject();
            JceOpenSSLPKCS8DecryptorProviderBuilder builder = new JceOpenSSLPKCS8DecryptorProviderBuilder();
            InputDecryptorProvider decryptor = builder.setProvider("BC").build(privatePassphrase.toCharArray());
            PrivateKeyInfo privateKeyInfo = encryptedPrivateKeyInfo.decryptPrivateKeyInfo(decryptor);
            JcaPEMKeyConverter jcaPEMKeyConverter = new JcaPEMKeyConverter();
            return (RSAPrivateKey) jcaPEMKeyConverter.getPrivateKey(privateKeyInfo);
        }
    }

    @Bean
    String snowflakeApiPublicKeyFingerprint(PublicKey snowflakeApiPublicKey) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(snowflakeApiPublicKey.getEncoded());
        String fingerprint = "SHA256:" + Base64.getEncoder().encodeToString(hash);
        return fingerprint;
    }

    private Reader resolvePrivateKeyPath() throws IOException {
        if (snowflakePrivateKeyPath.startsWith("classpath:")) {
            return new InputStreamReader(resourceLoader.getResource(snowflakePrivateKeyPath).getInputStream());
        }
        if (snowflakePrivateKeyPath.startsWith("arn:")) {
            var encryptedPrivateKeyText = getSecretValue.request(snowflakePrivateKeyPath);
            return new StringReader(encryptedPrivateKeyText);
        }
        throw new RuntimeException("Expected snowflakePrivateKeyPath to start with classparth or arn");
    }

    private String resolvePrivateKeyPassphrase() {
        if (snowflakePrivateKeyPassphrase.startsWith("arn:")) {
            return getSecretValue.request(snowflakePrivateKeyPassphrase);
        }
        return snowflakePrivateKeyPassphrase;
    }

}