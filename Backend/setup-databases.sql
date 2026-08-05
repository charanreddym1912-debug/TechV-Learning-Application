-- Run this once in MySQL before starting the services.
-- Each service owns its own database - this is the core microservices principle
-- of not sharing a database across services. Hibernate (ddl-auto: update) will
-- create the actual tables automatically on first startup of each service.

CREATE DATABASE IF NOT EXISTS student_db;
CREATE DATABASE IF NOT EXISTS trainer_db;
CREATE DATABASE IF NOT EXISTS coordinator_db;

-- auth-service has NO database of its own - it has no entities, no repositories.
-- It is a stateless service that only calls the other three over REST.
