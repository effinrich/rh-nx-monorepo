FROM maven:3.8.5-openjdk-17
ADD . ./
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jdk-jammy
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring
ARG JAR_FILE=target/*.jar
COPY --from=0 ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]