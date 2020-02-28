-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema calendario
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema calendario
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `calendario` DEFAULT CHARACTER SET utf8 ;
USE `calendario` ;

-- -----------------------------------------------------
-- Table `calendario`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `calendario`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 51
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `calendario`.`event`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `calendario`.`event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `start` BIGINT NOT NULL,
  `end` BIGINT NOT NULL,
  `creatorID` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 109
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `calendario`.`invitation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `calendario`.`invitation` (
  `user_from` INT NOT NULL,
  `user_to` INT NOT NULL,
  `event_id` INT NOT NULL,
  `answer` INT NULL DEFAULT '0',
  PRIMARY KEY (`user_from`, `user_to`, `event_id`),
  INDEX `fk_user_has_user_user1_idx` (`user_from` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
