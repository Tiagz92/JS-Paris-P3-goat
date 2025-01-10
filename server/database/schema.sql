-- SQLBook: Code
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

insert into goat(id, lastname, firstname, born_at, email, password, picture, presentation, video)
values
 (1, "Valjean", "Jean", "1984-01-01", "jean.valjean@mail.com", "123456", "https://www.zoologiste.com/images/xl/chevre.jpg", "Salut, moi c’est Jean, j’ai 24 ans et je suis étudiant en 2ème année en Histoire classique à Paris Sorbonne.", "https://www.youtube.com/watch?v=3wvatkyji1w"),
 (2, "Martin", "Julie", "1999-12-24", "julie.martin@mail.com", "abcd", "https://media.istockphoto.com/id/177369626/fr/photo/dr%C3%B4le-de-ch%C3%A8vre-envoie-sa-languette.jpg?s=612x612&w=0&k=20&c=qi4mhhIVM80vPLFztpO9ki0mO-6YwQXOifq72TyW7Tw=", "Hello, je suis Julie, j'aime la vie et manger.", NULL);

INSERT INTO main_tag (name)
VALUES
  ('Maths'),
  ('Français'),
  ('Histoire géographie'),
  ('Sciences'),
  ('Langues'),
  ('Culture'),
  ('Musique'),
  ('Art & design'),
  ('Numérique'),
  ('Développement personnel'),
  ('Finance / Administratif'),
  ('Sport'),
  ('Santé / Bien-être'),
  ('Voyage'),
  ('Autres');

-- Insérer les sub_tags avec leurs main_tags correspondants
INSERT INTO sub_tag (name, main_tag_id)
VALUES
  -- Maths
  ('Géométrie', 1),
  ('Algèbre', 1),
  ('Statistiques et probabilités', 1),
  ('Analyse', 1),
  ('Arithmétique', 1),
  ('Logique et raisonnement', 1),
  ('Maths appliquées', 1),

  -- Français
  ('Grammaire', 2),
  ('Conjugaison', 2),
  ('Orthographe', 2),
  ('Rédaction', 2),
  ('Analyse littéraire', 2),
  ('Littérature', 2),
  ('Poésie', 2),
  ('Prise de parole', 2),

  -- Histoire géographie
  ('Histoire ancienne', 3),
  ('Histoire moderne', 3),
  ('Géopolitique', 3),
  ('Cartographie', 3),
  ('Enjeux environnementaux', 3),
  ('Civilisations', 3),
  ('Personnages historiques', 3),
  ('Histoire locale', 3),

  -- Sciences
  ('S.V.T.', 4),
  ('Physique', 4),
  ('Chimie', 4),
  ('Sciences avancées', 4),
  ('Ingénierie', 4),
  ('Astronomie', 4),
  ('Neurosciences', 4),

  -- Langues
  ('Anglais', 5),
  ('Espagnol', 5),
  ('Allemand', 5),
  ('Portuguais', 5),
  ('Italien', 5),
  ('Chinois', 5),
  ('Japonais', 5),
  ('Coréen', 5),

  -- Culture
  ('Histoire de l’art', 6),
  ('Cinéma et audiovisuel', 6),
  ('Traditions et folklore', 6),
  ('Mythologie et légendes', 6),
  ('Sciences humaines', 6),
  ('Philosophie', 6),
  ('Médias et actualités', 6),

  -- Musique
  ('Solfège', 7),
  ('Instruments', 7),
  ('Chant', 7),
  ('Composition', 7),
  ('Musique électronique', 7),
  ('Histoire de la musique', 7),
  ('Genres musicaux', 7),

  -- Art & design
  ('Arts plastiques', 8),
  ('Design graphique', 8),
  ('Architecture', 8),
  ('Sculpture', 8),
  ('Photographie', 8),
  ('Mode et textile', 8),

  -- Numérique
  ('Programmation', 9),
  ('Création de sites web', 9),
  ('Marketing digital', 9),
  ('IA et machine learning', 9),
  ('Cybersécurité', 9),
  ('Logiciels informatiques', 9),
  ('Analyse de données', 9),

  -- Développement personnel
  ('Gestion du temps', 10),
  ('Communication', 10),
  ('Leadership', 10),
  ('Coaching de vie', 10),
  ('Créativité', 10),

  -- Finance / Administratif
  ('Comptabilité', 11),
  ('Épargne et investissement', 11),
  ('Fiscalité et impôts', 11),
  ('Gestion d’entreprise', 11),
  ('Documents administratifs', 11),
  ('Gestion des dettes et crédits', 11),
  ('Création de budgets', 11),
  ('Éducation financière', 11),

  -- Sport
  ('Musculation et fitness', 12),
  ('Yoga et pilates', 12),
  ('Préparation physique', 12),
  ('Nutrition sportive', 12),
  ('Équipements et techniques', 12),
  ('Coaching', 12),

  -- Santé / Bien-être
  ('Nutrition', 13),
  ('Méditation et relaxation', 13),
  ('Santé mentale', 13),
  ('Médecine douce', 13),
  ('Premiers secours', 13),
  ('Soins du corps', 13),
  ('Sommeil', 13),
  ('Gestes et postures', 13),

  -- Voyage
  ('Guides de voyage', 14),
  ('Voyager pas cher', 14),
  ('Voyager durablement', 14),
  ('Cultures et traditions locales', 14),
  ('Organisation et logistique', 14),
  ('Conseils pour expatriés', 14),
  ('Exploration insolite', 14),

  -- Autres
  ('Autres', 15);





