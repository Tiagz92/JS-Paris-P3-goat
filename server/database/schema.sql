-- SQLBook: Code
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Schema goat_db
CREATE SCHEMA IF NOT EXISTS `goat_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `goat_db`;

-- Table `goat_db`.`main_tag`
CREATE TABLE IF NOT EXISTS `goat_db`.`main_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Table `goat_db`.`sub_tag`
CREATE TABLE IF NOT EXISTS `goat_db`.`sub_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `main_tag_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`main_tag_id`) REFERENCES `goat_db`.`main_tag` (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Table `goat_db`.`goat`
CREATE TABLE IF NOT EXISTS `goat_db`.`goat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL COMMENT 'Stores hashed password',
  `avatar` VARCHAR(255),
  `presentation` TEXT NOT NULL,
  `video` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Table `goat_db`.`advert`
CREATE TABLE IF NOT EXISTS `goat_db`.`advert` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` TEXT NOT NULL,
  `goat_id` INT NOT NULL,
  `main_tag_id` INT NOT NULL,
  `sub_tag_id` INT NOT NULL,
  `status` ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    REFERENCES `goat_db`.`goat` (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Table `goat_db`.`main_sub_tag`
CREATE TABLE IF NOT EXISTS `goat_db`.`main_sub_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `main_tag_id` INT NOT NULL,
  `sub_tag_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_main_sub_tag` (`main_tag_id`, `sub_tag_id`),
  INDEX `fk_main_tag_id_idx` (`main_tag_id` ASC) VISIBLE,
  INDEX `fk_sub_tag_id_idx` (`sub_tag_id` ASC) VISIBLE,
  CONSTRAINT `fk_main_tag_id`
    FOREIGN KEY (`main_tag_id`)
    REFERENCES `goat_db`.`main_tag` (`id`),
  CONSTRAINT `fk_sub_tag_id`
    FOREIGN KEY (`sub_tag_id`)
    REFERENCES `goat_db`.`sub_tag` (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Table `goat_db`.`slot`
CREATE TABLE IF NOT EXISTS `goat_db`.`slot` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `start_at` DATETIME NOT NULL,
  `duration` INT,
  `meet_link` VARCHAR(255) DEFAULT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `advert_id` INT NOT NULL,
  `goat_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_advert_id_idx` (`advert_id` ASC) VISIBLE,
  INDEX `fk_goat_id_idx` (`goat_id` ASC) VISIBLE,
  CONSTRAINT `fk_advert_id`
    FOREIGN KEY (`advert_id`)
    REFERENCES `goat_db`.`advert` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_slot_goat_id`
    FOREIGN KEY (`goat_id`)
    REFERENCES `goat_db`.`goat` (`id`),
  CONSTRAINT `check_duration_positive` CHECK ((`duration` > 0))
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Table `goat_db`.`reservations`
CREATE TABLE IF NOT EXISTS `goat_db`.`reservations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slot_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `google_meet_link` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_reservation_slot_idx` (`slot_id` ASC) VISIBLE,
  INDEX `fk_reservation_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_reservation_slot`
    FOREIGN KEY (`slot_id`)
    REFERENCES `goat_db`.`slot` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_reservation_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `goat_db`.`goat` (`id`)
    ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Table `goat_db`.`item`
CREATE TABLE IF NOT EXISTS `goat_db`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Insertion des données de test
INSERT INTO `goat_db`.`goat` (first_name, last_name, email, password, avatar, presentation, video)
VALUES
 ('Valjean', 'Jean', 'jean.valjean@mail.com', SHA2('123456', 256), 'https://www.zoologiste.com/images/xl/chevre.jpg', 'Salut, moi c''est Jean, j''ai 24 ans et je suis étudiant en 2ème année en Histoire classique à Paris Sorbonne.', 'https://www.youtube.com/watch?v=3wvatkyji1w'),
 ('Martin', 'Julie', 'julie.martin@mail.com', SHA2('abcd', 256), 'https://media.istockphoto.com/id/177369626/fr/photo/dr%C3%B4le-de-ch%C3%A8vre-envoie-sa-languette.jpg?s=612x612&w=0&k=20&c=qi4mhhIVM80vPLFztpO9ki0mO-6YwQXOifq72TyW7Tw=', 'Hello, je suis Julie, j''aime la vie et manger.', NULL);

-- Insertion des main_tags
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

-- Insertion des sub_tags
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
('Histoire de l''art', 6),
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
("Gestion d'entreprise", 11),
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

-- Insertion des relations main_tag/sub_tag
INSERT INTO main_sub_tag (main_tag_id, sub_tag_id)
VALUES
  -- Maths
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),

  -- Français
  (2, 8),
  (2, 9),
  (2, 10),
  (2, 11),
  (2, 12),
  (2, 13),
  (2, 14),
  (2, 15),

  -- Histoire géographie
  (3, 16),
  (3, 17),
  (3, 18),
  (3, 19),
  (3, 20),
  (3, 21),
  (3, 22),
  (3, 23),

  -- Sciences
  (4, 24),
  (4, 25),
  (4, 26),
  (4, 27),
  (4, 28),
  (4, 29),
  (4, 30),

  -- Langues
  (5, 31),
  (5, 32),
  (5, 33),
  (5, 34),
  (5, 35),
  (5, 36),
  (5, 37),
  (5, 38),

  -- Culture
  (6, 39),
  (6, 40),
  (6, 41),
  (6, 42),
  (6, 43),
  (6, 44),
  (6, 45),

  -- Musique
  (7, 46),
  (7, 47),
  (7, 48),
  (7, 49),
  (7, 50),
  (7, 51),
  (7, 52),

  -- Art & design
  (8, 53),
  (8, 54),
  (8, 55),
  (8, 56),
  (8, 57),
  (8, 58),

  -- Numérique
  (9, 59),
  (9, 60),
  (9, 61),
  (9, 62),
  (9, 63),
  (9, 64),
  (9, 65),

  -- Développement personnel
  (10, 66),
  (10, 67),
  (10, 68),
  (10, 69),
  (10, 70),

  -- Finance / Administratif
  (11, 71),
  (11, 72),
  (11, 73),
  (11, 74),
  (11, 75),
  (11, 76),
  (11, 77),
  (11, 78),

  -- Sport
  (12, 79),
  (12, 80),
  (12, 81),
  (12, 82),
  (12, 83),
  (12, 84),

  -- Santé / Bien-être
  (13, 85),
  (13, 86),
  (13, 87),
  (13, 88),
  (13, 89),
  (13, 90),
  (13, 91),
  (13, 92),

  -- Voyage
  (14, 93),
  (14, 94),
  (14, 95),
  (14, 96),
  (14, 97),
  (14, 98),
  (14, 99),

  -- Autres
  (15, 100);