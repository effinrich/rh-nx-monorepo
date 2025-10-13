
auto_auth {

  method {
    type = "token_file"

    config {
      token_file_path = "/Users/mstephenson6/.vault-token"
    }
  }
}

template_config {
  static_secret_render_interval = "5m"
  exit_on_retry_failure         = true
}

vault {
  address = "https://vault.core.redesignhealth.com"
}

env_template "ROCKETCHAT_POC_CLIENT_ID" {
  contents             = "{{ with secret \"developers/data/dev/rocketchat-poc\" }}{{ .Data.data.CLIENT_ID }}{{ end }}"
  error_on_missing_key = true
}
env_template "ROCKETCHAT_POC_CLIENT_SECRET" {
  contents             = "{{ with secret \"developers/data/dev/rocketchat-poc\" }}{{ .Data.data.CLIENT_SECRET }}{{ end }}"
  error_on_missing_key = true
}

exec {
  command                   = ["./write-dotenv.sh"]
  restart_on_secret_changes = "always"
  restart_stop_signal       = "SIGTERM"
}
