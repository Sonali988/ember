-- CreateTable
CREATE TABLE `songs` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NULL,
    `ccli` VARCHAR(191) NULL,
    `content` LONGTEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verses` (
    `id` VARCHAR(191) NOT NULL,
    `songId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'verse',
    `number` INTEGER NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slides` (
    `id` VARCHAR(191) NOT NULL,
    `songId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `backgroundColor` VARCHAR(191) NOT NULL DEFAULT 'solid',
    `backgroundValue` VARCHAR(191) NULL,
    `backgroundOpacity` DOUBLE NOT NULL DEFAULT 1.0,
    `textStyle` TEXT NOT NULL,
    `notes` LONGTEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcements` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `backgroundColor` VARCHAR(191) NOT NULL DEFAULT 'solid',
    `backgroundValue` VARCHAR(191) NULL,
    `backgroundOpacity` DOUBLE NOT NULL DEFAULT 1.0,
    `textStyle` TEXT NOT NULL,
    `duration` INTEGER NOT NULL DEFAULT 10,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scriptures` (
    `id` VARCHAR(191) NOT NULL,
    `book` VARCHAR(191) NOT NULL,
    `chapter` INTEGER NOT NULL,
    `startVerse` INTEGER NOT NULL,
    `endVerse` INTEGER NOT NULL,
    `text` LONGTEXT NOT NULL,
    `translation` VARCHAR(191) NOT NULL DEFAULT 'NIV',
    `textStyle` TEXT NOT NULL,
    `backgroundColor` VARCHAR(191) NOT NULL DEFAULT 'solid',
    `backgroundValue` VARCHAR(191) NULL,
    `backgroundOpacity` DOUBLE NOT NULL DEFAULT 1.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_items` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `songId` VARCHAR(191) NULL,
    `announcementId` VARCHAR(191) NULL,
    `scriptureId` VARCHAR(191) NULL,
    `mediaId` VARCHAR(191) NULL,
    `duration` INTEGER NULL,
    `notes` LONGTEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_orders` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notes` (
    `id` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `serviceOrderId` VARCHAR(191) NOT NULL,

    INDEX `notes_serviceOrderId_timestamp_idx`(`serviceOrderId`, `timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verse_detections` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `book` VARCHAR(191) NOT NULL,
    `chapter` INTEGER NOT NULL,
    `startVerse` INTEGER NOT NULL,
    `endVerse` INTEGER NOT NULL,
    `textEN` LONGTEXT NOT NULL,
    `textHI` LONGTEXT NOT NULL,
    `rawSpeech` LONGTEXT NOT NULL,
    `detectedFromSpeech` BOOLEAN NOT NULL DEFAULT true,
    `confidence` DOUBLE NOT NULL DEFAULT 0,
    `serviceOrderId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `verse_detections_serviceOrderId_createdAt_idx`(`serviceOrderId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlists` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlist_songs` (
    `playlistId` VARCHAR(191) NOT NULL,
    `songId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`playlistId`, `songId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_files` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `duration` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `verses` ADD CONSTRAINT `verses_songId_fkey` FOREIGN KEY (`songId`) REFERENCES `songs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `slides` ADD CONSTRAINT `slides_songId_fkey` FOREIGN KEY (`songId`) REFERENCES `songs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_items` ADD CONSTRAINT `service_items_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_items` ADD CONSTRAINT `service_items_songId_fkey` FOREIGN KEY (`songId`) REFERENCES `songs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_items` ADD CONSTRAINT `service_items_announcementId_fkey` FOREIGN KEY (`announcementId`) REFERENCES `announcements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_items` ADD CONSTRAINT `service_items_scriptureId_fkey` FOREIGN KEY (`scriptureId`) REFERENCES `scriptures`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_items` ADD CONSTRAINT `service_items_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_serviceOrderId_fkey` FOREIGN KEY (`serviceOrderId`) REFERENCES `service_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `verse_detections` ADD CONSTRAINT `verse_detections_serviceOrderId_fkey` FOREIGN KEY (`serviceOrderId`) REFERENCES `service_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist_songs` ADD CONSTRAINT `playlist_songs_playlistId_fkey` FOREIGN KEY (`playlistId`) REFERENCES `playlists`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist_songs` ADD CONSTRAINT `playlist_songs_songId_fkey` FOREIGN KEY (`songId`) REFERENCES `songs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
