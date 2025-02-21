const express = require('express');
const db = require('../Libraries/Database');
const router = express.Router();

router.all("/", async (req, res) => {
    await db.query(`
        BEGIN;


CREATE TABLE IF NOT EXISTS public.user_location
(
    id integer NOT NULL,
    longtitude double precision,
    latitude double precision,
    "timestamp" time without time zone DEFAULT CURRENT_TIMESTAMP,
    "userId" integer,
    CONSTRAINT user_location_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_permission
(
    id integer NOT NULL,
    user_giving integer,
    user_receiving integer,
    CONSTRAINT user_permission_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users
(
    userid serial NOT NULL,
    firstname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    lastname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    phone character varying(50) COLLATE pg_catalog."default",
    created_at time without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at time without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (userid),
    CONSTRAINT users_email_key UNIQUE (email)
);

ALTER TABLE IF EXISTS public.user_location
    ADD CONSTRAINT "userId" FOREIGN KEY ("userId")
    REFERENCES public.users (userid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.user_permission
    ADD CONSTRAINT user_giving FOREIGN KEY (user_giving)
    REFERENCES public.users (userid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.user_permission
    ADD CONSTRAINT user_receiving FOREIGN KEY (user_receiving)
    REFERENCES public.users (userid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;

        `)

        res.status(201).json({
            "message":"migrated successfully"
        })
})
module.exports = router;