FROM eclipse-temurin:17-jdk-jammy
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring
ADD application/certs /certs
ADD application/target/*.jar /app.jar
#Uncomment below line to use debugging with the IDE
#ENV JAVA_TOOL_OPTIONS -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
ENTRYPOINT ["java","-jar","/app.jar"]
