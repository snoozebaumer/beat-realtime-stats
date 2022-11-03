CREATE SCHEMA IF NOT EXISTS `beat`;

CREATE TABLE `beat`.`runs` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`StartDateTime` TIMESTAMP NOT NULL,
	`EndDateTime` TIMESTAMP,
	`Is_Running` BOOLEAN,
	`Bottlecap_Amount` INT,
	`Cigarette_Amount` INT,
	`Plasticcap_Amount` INT,
	`Key_Amount` INT,
	`Coin_Amount` INT,
	`Ring_Amount` INT,
	PRIMARY KEY (`Id`)
);