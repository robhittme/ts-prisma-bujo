-- CreateTable
CREATE TABLE "__migration" (
    "digest" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contents" TEXT NOT NULL,

    CONSTRAINT "__migration_pkey" PRIMARY KEY ("digest")
);

-- CreateTable
CREATE TABLE "entries" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "entry_type" TEXT DEFAULT 'task',
    "completed" BOOLEAN DEFAULT false,
    "priority" BOOLEAN DEFAULT false,
    "created_timestamp" BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM now()),
    "modified_timestamp" BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM now()),

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "session_token" TEXT NOT NULL DEFAULT substr(md5((random())::text), 0, 32),
    "expires_at" BIGINT DEFAULT (EXTRACT(epoch FROM now()) + (604800)::numeric),
    "created_timestamp" BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM now()),
    "modified_timestamp" BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM now()),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "password_hash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "verification_code" INTEGER DEFAULT (floor((random() * (1000000)::double precision)))::integer,
    "verified" BOOLEAN DEFAULT false,
    "passwordreset" BOOLEAN DEFAULT false,
    "created_timestamp" BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM now()),
    "modified_timestamp" BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM now()),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_item" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "collection_id" INTEGER NOT NULL,

    CONSTRAINT "list_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "list_item" ADD CONSTRAINT "list_item_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
