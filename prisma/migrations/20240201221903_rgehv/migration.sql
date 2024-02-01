-- CreateTable
CREATE TABLE "user" (
    "id" STRING NOT NULL,
    "username" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "name" STRING NOT NULL,
    "age" STRING NOT NULL,
    "verified" BOOL NOT NULL DEFAULT false,
    "saltA" STRING NOT NULL,
    "saltB" STRING NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" STRING NOT NULL,
    "relatedUsername" STRING NOT NULL,
    "certifications" STRING[] DEFAULT ARRAY[]::STRING[],
    "hoursEarned" INT4 NOT NULL DEFAULT 0,
    "minutesEarned" FLOAT8 NOT NULL DEFAULT 0.00,
    "hoursLearnt" INT4 NOT NULL DEFAULT 0,
    "minutesLearnt" INT4 NOT NULL DEFAULT 0,
    "sessionsAttended" INT4 NOT NULL DEFAULT 0,
    "sessionsHosted" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
