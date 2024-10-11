CREATE TABLE public.app_user (
	id bigserial NOT NULL,
	delete_at timestamp NULL,
	deleted bool NULL,
	disabled bool NULL,
	email varchar(255) NULL,
	country varchar(255) null,
	institution varchar (255) null,
	last_login timestamp NULL,
	full_name varchar(255) NULL,
	verified bool NULL,
	CONSTRAINT app_user_pkey PRIMARY KEY (id)
);


-- public.confirmation_token definition

-- Drop table

-- DROP TABLE public.confirmation_token;

CREATE TABLE public.confirmation_token (
	id bigserial NOT NULL,
	confirmed_at timestamp NULL,
	create_at timestamp NULL,
	expires_at timestamp NULL,
	"token" varchar(255) NULL,
	app_user_id int8 NOT NULL,
	"type" varchar(255) NULL,
	CONSTRAINT confirmation_token_pkey PRIMARY KEY (id),
	CONSTRAINT fko9fl25wqyh7w7mnfkdqen1rcm FOREIGN KEY (app_user_id) REFERENCES public.app_user(id)
);



CREATE TABLE public."policy" (
	id bigserial NOT NULL,
	title varchar(255) NULL,
	code varchar(255) NULL,
	derogation_date timestamp NULL,
	start_date timestamp NULL,
	disabled bool NULL,
	country varchar(255) NULL,
	region varchar(255) NULL,
	xml_file varchar(10000) NULL,
	app_user_id int8 NOT NULL,
	"type" varchar(255) NULL,
	is_general bool NULL,
	creation_date timestamp NULL,
	modified_date timestamp NULL,

	CONSTRAINT policy_pkey PRIMARY KEY (id),
	CONSTRAINT fko9fl25wqyh7w7mnoipqen1rcm FOREIGN KEY (app_user_id) REFERENCES public.app_user(id)
);


INSERT INTO public.app_user (delete_at, deleted, disabled, email,country,institution, last_login, full_name, verified) VALUES(NULL, false, false, 'user1@gmail.com','Spain','AYESA', now(), 'user1', true);

insert
	into
	public."policy" (title,
	code,
	derogation_date,
	start_date,
	disabled,
	country,
	region,
	xml_file,
	app_user_id,
	"type",
	is_general,
	creation_date,
	modified_date)
values('politica_titulo1',
'codigo',
now(),
now(),
false,
'Spain',
'Seville',
'contenido del xml iria aqui',
1,
'SOCIOECONOMIC',
false,
now(),
now());