-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema goat_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema goat_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `goat_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `goat_db` ;

-- -----------------------------------------------------
-- Table `goat_db`.`main_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`main_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`sub_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`sub_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`goat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`goat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lastname` VARCHAR(255) NOT NULL,
  `firstname` VARCHAR(255) NOT NULL,
  `born_at` DATE NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `picture` VARCHAR(255) NOT NULL,
  `presentation` TEXT NOT NULL,
  `video` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`advert`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`advert` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` TEXT NOT NULL,
  `goat_id` INT NULL DEFAULT NULL,
  `main_tag_id` INT NOT NULL,
  `sub_tag_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `advert_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_goat_id_idx` (`goat_id` ASC) VISIBLE,
  INDEX `fk_advert_main_tag1_idx` (`main_tag_id` ASC) VISIBLE,
  INDEX `fk_advert_sub_tag1_idx` (`sub_tag_id` ASC) VISIBLE,
  CONSTRAINT `fk_advert_main_tag1`
    FOREIGN KEY (`main_tag_id`)
    REFERENCES `goat_db`.`main_tag` (`id`),
  CONSTRAINT `fk_advert_sub_tag1`
    FOREIGN KEY (`sub_tag_id`)
    REFERENCES `goat_db`.`sub_tag` (`id`),
  CONSTRAINT `fk_goat_id`
    FOREIGN KEY (`goat_id`)
    REFERENCES `goat_db`.`goat` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`main_sub_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`main_sub_tag` (
  `main_tag_id` INT NULL DEFAULT NULL,
  `sub_tag_id` INT NULL DEFAULT NULL,
  INDEX `fk_main_tag_id_idx` (`main_tag_id` ASC) VISIBLE,
  INDEX `fk_sub_tag_id_idx` (`sub_tag_id` ASC) VISIBLE,
  CONSTRAINT `fk_main_tag_id`
    FOREIGN KEY (`main_tag_id`)
    REFERENCES `goat_db`.`main_tag` (`id`),
  CONSTRAINT `fk_sub_tag_id`
    FOREIGN KEY (`sub_tag_id`)
    REFERENCES `goat_db`.`sub_tag` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`slot`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`slot` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `start_at` DATETIME NOT NULL,
  `duration` INT NOT NULL,
  `meet_link` VARCHAR(255) NOT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `advert_id` INT NOT NULL,
  `goat_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_advert_id_idx` (`advert_id` ASC) VISIBLE,
  INDEX `fk_goat_id_idx` (`goat_id` ASC) VISIBLE,
  CONSTRAINT `fk_advert_id`
    FOREIGN KEY (`advert_id`)
    REFERENCES `goat_db`.`advert` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_slot_goat_id`
    FOREIGN KEY (`goat_id`)
    REFERENCES `goat_db`.`goat` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

insert into goat(lastname, firstname, born_at, email, password, picture, presentation, video)
values
 ("Valjean", "Jean", "1984-01-01", "jean.valjean@mail.com", "123456", "https://www.zoologiste.com/images/xl/chevre.jpg", "Salut, moi c’est Jean, j’ai 24 ans et je suis étudiant en 2ème année en Histoire classique à Paris Sorbonne.", "https://www.youtube.com/watch?v=3wvatkyji1w"),
 ("Martin", "Julie", "1999-12-24", "julie.martin@mail.com", "abcd", "https://media.istockphoto.com/id/177369626/fr/photo/dr%C3%B4le-de-ch%C3%A8vre-envoie-sa-languette.jpg?s=612x612&w=0&k=20&c=qi4mhhIVM80vPLFztpO9ki0mO-6YwQXOifq72TyW7Tw=", "Hello, je suis Julie, j'aime la vie et manger.", NULL);

insert into main_tag(name)
values
  ("Math"),
  ("Histoire");

insert into sub_tag(name)
values
  ("Géométrie"),
  ("Révolution française");

insert into advert(description, goat_id, main_tag_id, sub_tag_id)
values
  ("Découvrez les carrés, les triangles et toutes autres formes géométriques", 1, 1, 1),
  ("Vive la révolution, vive la décapitation", 2, 2, 2);

insert into main_sub_tag(main_tag_id, sub_tag_id)
values
  (1, 1),
  (2, 2);

insert into slot(start_at, duration, meet_link, comment, advert_id, goat_id)
values
  ("2025-02-21 18:00:00", 60, "https://meet.google.com/bje-qapy-ysj", "Je veux découvrir les secrets des carrés", 1, 2),
  ("2025-08-21 12:00:00", 120, "https://meet.google.com/bje-qapy-ysj", "Il y aura beaucoup de sang ?", 2, 1);


