--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AspNetRoleClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetRoleClaims" (
                                           "Id" integer NOT NULL,
                                           "RoleId" text NOT NULL,
                                           "ClaimType" text,
                                           "ClaimValue" text
);


ALTER TABLE public."AspNetRoleClaims" OWNER TO postgres;

--
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."AspNetRoleClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetRoleClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: AspNetRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetRoles" (
                                      "Id" text NOT NULL,
                                      "Name" character varying(256),
                                      "NormalizedName" character varying(256),
                                      "ConcurrencyStamp" text
);


ALTER TABLE public."AspNetRoles" OWNER TO postgres;

--
-- Name: AspNetUserClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserClaims" (
                                           "Id" integer NOT NULL,
                                           "UserId" text NOT NULL,
                                           "ClaimType" text,
                                           "ClaimValue" text
);


ALTER TABLE public."AspNetUserClaims" OWNER TO postgres;

--
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."AspNetUserClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetUserClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: AspNetUserLogins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserLogins" (
                                           "LoginProvider" text NOT NULL,
                                           "ProviderKey" text NOT NULL,
                                           "ProviderDisplayName" text,
                                           "UserId" text NOT NULL
);


ALTER TABLE public."AspNetUserLogins" OWNER TO postgres;

--
-- Name: AspNetUserRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserRoles" (
                                          "UserId" text NOT NULL,
                                          "RoleId" text NOT NULL
);


ALTER TABLE public."AspNetUserRoles" OWNER TO postgres;

--
-- Name: AspNetUserTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserTokens" (
                                           "UserId" text NOT NULL,
                                           "LoginProvider" text NOT NULL,
                                           "Name" text NOT NULL,
                                           "Value" text
);


ALTER TABLE public."AspNetUserTokens" OWNER TO postgres;

--
-- Name: AspNetUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUsers" (
                                      "Id" text NOT NULL,
                                      "UserName" character varying(256),
                                      "NormalizedUserName" character varying(256),
                                      "Email" character varying(256),
                                      "NormalizedEmail" character varying(256),
                                      "EmailConfirmed" boolean NOT NULL,
                                      "PasswordHash" text,
                                      "SecurityStamp" text,
                                      "ConcurrencyStamp" text,
                                      "PhoneNumber" text,
                                      "PhoneNumberConfirmed" boolean NOT NULL,
                                      "TwoFactorEnabled" boolean NOT NULL,
                                      "LockoutEnd" timestamp with time zone,
                                      "LockoutEnabled" boolean NOT NULL,
                                      "AccessFailedCount" integer NOT NULL
);


ALTER TABLE public."AspNetUsers" OWNER TO postgres;

--
-- Name: Boards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Boards" (
                                 "Id" uuid NOT NULL,
                                 "PlayerId" uuid NOT NULL,
                                 "GameId" uuid NOT NULL,
                                 "Numbers" integer[] NOT NULL
);


ALTER TABLE public."Boards" OWNER TO postgres;

--
-- Name: Games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Games" (
                                "Id" uuid NOT NULL,
                                "StartDate" timestamp without time zone NOT NULL,
                                "EndDate" timestamp without time zone,
                                "WinningSequence" integer[] NOT NULL
);


ALTER TABLE public."Games" OWNER TO postgres;

--
-- Name: Players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Players" (
                                  "Id" uuid NOT NULL,
                                  "UserId" text NOT NULL,
                                  "Name" character varying(100) NOT NULL,
                                  "Balance" numeric(10,2) DEFAULT 0 NOT NULL,
                                  "IsActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Players" OWNER TO postgres;

--
-- Name: Transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transactions" (
                                       "Id" uuid NOT NULL,
                                       "PlayerId" uuid NOT NULL,
                                       "Amount" numeric(10,2) NOT NULL,
                                       "TransactionDate" timestamp without time zone NOT NULL,
                                       "MobilePayNumber" character varying(50)
);


ALTER TABLE public."Transactions" OWNER TO postgres;

--
-- Name: Winners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Winners" (
                                  "Id" uuid NOT NULL,
                                  "PlayerId" uuid NOT NULL,
                                  "GameId" uuid NOT NULL,
                                  "WinningAmount" numeric(10,2) NOT NULL
);


ALTER TABLE public."Winners" OWNER TO postgres;

--
-- Data for Name: AspNetRoleClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetRoleClaims" ("Id", "RoleId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- Data for Name: AspNetRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp") FROM stdin;
aabe3cfa-e672-4676-b80e-2eef93b765e0	Admin	ADMIN	\N
0e41dd53-6c6e-406a-b2a8-f66430a05abe	Player	PLAYER	\N
\.


--
-- Data for Name: AspNetUserClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserClaims" ("Id", "UserId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- Data for Name: AspNetUserLogins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserLogins" ("LoginProvider", "ProviderKey", "ProviderDisplayName", "UserId") FROM stdin;
\.


--
-- Data for Name: AspNetUserRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserRoles" ("UserId", "RoleId") FROM stdin;
ef1ff6e3-7548-4630-a44b-61a3cea6eef6	aabe3cfa-e672-4676-b80e-2eef93b765e0
89574888-cff5-4d08-b8eb-0d9bd04e2d05	0e41dd53-6c6e-406a-b2a8-f66430a05abe
cf9cc290-ce4c-4d68-b1e8-88c58f7566ab	0e41dd53-6c6e-406a-b2a8-f66430a05abe
9cead611-74b6-4d16-ae2f-968aa2d274b4	0e41dd53-6c6e-406a-b2a8-f66430a05abe
577fef26-b4f2-4e0b-bcba-3b39b999bfbc	0e41dd53-6c6e-406a-b2a8-f66430a05abe
f14e1f82-1a77-4350-858a-c315932b04ff	0e41dd53-6c6e-406a-b2a8-f66430a05abe
8a526e72-d2d8-4d85-821e-666bab6e90b9	0e41dd53-6c6e-406a-b2a8-f66430a05abe
e50053bd-80a0-4509-b3f3-c853107a857e	0e41dd53-6c6e-406a-b2a8-f66430a05abe
2ce16621-da5f-45e3-a283-7f1ee0824ad1	0e41dd53-6c6e-406a-b2a8-f66430a05abe
a5e286af-7610-4dcd-96bb-d30db128df1f	0e41dd53-6c6e-406a-b2a8-f66430a05abe
e30a2ea2-9345-49ff-8834-852cd0ee8f9c	0e41dd53-6c6e-406a-b2a8-f66430a05abe
a6b502f4-ae09-4b25-b23b-f09490751136	0e41dd53-6c6e-406a-b2a8-f66430a05abe
dae153bc-4dc6-47f2-a38c-4ec51d15e5a6	0e41dd53-6c6e-406a-b2a8-f66430a05abe
9dc904af-e4ad-42a8-9c30-c3f8a9addb34	0e41dd53-6c6e-406a-b2a8-f66430a05abe
0f3ee4e6-87fe-4033-9d63-0860809e671a	0e41dd53-6c6e-406a-b2a8-f66430a05abe
6d2cf8d8-f2b5-479f-bb18-f54128e8e228	0e41dd53-6c6e-406a-b2a8-f66430a05abe
305685ba-1e1b-4211-94d4-e2b51f38455a	0e41dd53-6c6e-406a-b2a8-f66430a05abe
f6896952-1b61-499c-894b-804bb55616ed	0e41dd53-6c6e-406a-b2a8-f66430a05abe
bf0beeab-3726-4a4d-b72d-733ef05785f0	0e41dd53-6c6e-406a-b2a8-f66430a05abe
ef1ee5a5-689d-42c9-ac31-05970f0c571a	0e41dd53-6c6e-406a-b2a8-f66430a05abe
464fd5d7-520f-468f-ba05-489f863ac012	0e41dd53-6c6e-406a-b2a8-f66430a05abe
2a07dde7-7245-4321-bcc6-d1eef10baf97	0e41dd53-6c6e-406a-b2a8-f66430a05abe
468a193e-8e59-495e-979d-57f85466aeea	0e41dd53-6c6e-406a-b2a8-f66430a05abe
abbebc65-0820-4fde-b377-11fbf6536eb5	0e41dd53-6c6e-406a-b2a8-f66430a05abe
\.


--
-- Data for Name: AspNetUserTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserTokens" ("UserId", "LoginProvider", "Name", "Value") FROM stdin;
\.


--
-- Data for Name: AspNetUsers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUsers" ("Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnd", "LockoutEnabled", "AccessFailedCount") FROM stdin;
ef1ff6e3-7548-4630-a44b-61a3cea6eef6	admin@example.com	ADMIN@EXAMPLE.COM	admin@example.com	ADMIN@EXAMPLE.COM	t	argon2id$sDFLbpwBB6NupYPRLlAbGg==$u676Ws8R+dpA8poJGqO653CABNGLi5GgVBEcWkYuMxI=	QZJRG7XVRIGUKL64FX5CD5K5A5ROE37N	fe191fd4-9620-46c8-a26e-fa459ad2ae62	\N	f	f	\N	t	0
89574888-cff5-4d08-b8eb-0d9bd04e2d05	reader@example.com	READER@EXAMPLE.COM	reader@example.com	READER@EXAMPLE.COM	t	argon2id$mJdAoYUwuNe5aCeMNoNcAw==$iZZodMiKVBOrzxhhzAg0YRiiakdyvQo4reGqKAhnd4c=	FRMC63EAZWI3533Q5N6A4HIHO43EDBIB	87235585-9f24-46da-b9c1-6409199b1c43	\N	f	f	\N	t	0
cf9cc290-ce4c-4d68-b1e8-88c58f7566ab	acepol@gmaol.com	ACEPOL@GMAOL.COM	acepol@gmaol.com	ACEPOL@GMAOL.COM	f	argon2id$7v+oC2eX3A/HuzYSNRM5nA==$0OoxdkOwrHg1p4Z2hA1oZfMOZcqWGr5V6I+R7D2RNnE=	LEU3NZJDRDDLHQVMK2LVNMROWC4EQ2H7	96c06bc3-e623-484a-867d-bebafa8d20e9	\N	f	f	\N	t	0
9cead611-74b6-4d16-ae2f-968aa2d274b4	aaa@ww.com	AAA@WW.COM	aaa@ww.com	AAA@WW.COM	f	argon2id$Ys6mFY12hpJQtIMVIH3Nfw==$RImHndcdPGPlQPGMoKn5+xLyqLNS0xfKHfF/85Oui2c=	BS5MSRSWX5AQN5TGYQFMXS7X67XEDFDG	cb121688-709a-4f6e-a53f-9ce1b670a82f	\N	f	f	\N	t	0
577fef26-b4f2-4e0b-bcba-3b39b999bfbc	acepol111@gmail.com	ACEPOL111@GMAIL.COM	acepol111@gmail.com	ACEPOL111@GMAIL.COM	f	argon2id$hZOGIvek90ML8mqGA0hDBw==$EoNfp+F3PH2u+/7FCK9oPjglUY+ahROXbL23Zg7wrhQ=	X52AKYU3QGFSOVF3EHFATWCUAEF2XI3L	3e9f618b-35f5-43a5-a83a-33e9755d5612	\N	f	f	\N	t	0
f14e1f82-1a77-4350-858a-c315932b04ff	acepol321@gmail.com	ACEPOL321@GMAIL.COM	acepol321@gmail.com	ACEPOL321@GMAIL.COM	f	argon2id$YFL5KFarS0j9tmOBl75FCw==$A4Hs+OFfsE5Ps/YGMEX8TEhnpcVJsg0wuZ+jkQPCswQ=	HTJ7AJIZOWPOKQ3RL3FG23AOWMAW5ARR	5365396a-12a8-461e-a254-0519d279a693	\N	f	f	\N	t	0
8a526e72-d2d8-4d85-821e-666bab6e90b9	acepol555@gmail.com	ACEPOL555@GMAIL.COM	acepol555@gmail.com	ACEPOL555@GMAIL.COM	f	argon2id$qIFEQvgtpZEkQN9K5AN8VQ==$fpwjLJt5EkXuuQ4fY+j4chx3Elb+mARqjvOs1VGo7Lc=	6CQHBS7ML3GHLVWPMQUVK5MOECDSETBB	23d765e8-c6f5-491e-b008-b151863d0f73	\N	f	f	\N	t	0
e50053bd-80a0-4509-b3f3-c853107a857e	acepol5552@gmail.com	ACEPOL5552@GMAIL.COM	acepol5552@gmail.com	ACEPOL5552@GMAIL.COM	f	argon2id$uyeY+jw97qkrHSDZCaJvwA==$1zgOoHn/eE9JdptMY0BqA3SPMxS2NQk+lHLA42Iccp8=	CL2IRD3QMRRBF22CQ5ITF6KEAN3AOORY	74edf0e2-2873-4f41-a3f6-c28ca637c313	\N	f	f	\N	t	0
2ce16621-da5f-45e3-a283-7f1ee0824ad1	acepol55252@gmail.com	ACEPOL55252@GMAIL.COM	acepol55252@gmail.com	ACEPOL55252@GMAIL.COM	f	argon2id$yrxvCnc2KyfNttW7hRu8hA==$EJiBv/DkzUkbPuLYd/OiUxpdtFuHS6yDHND+qKyZ4wI=	WWFHXUA2GFKSBJGCFPK7ELMBPDBAQJ7X	605dd08d-618c-4027-955d-fe3450c6af6a	\N	f	f	\N	t	0
a5e286af-7610-4dcd-96bb-d30db128df1f	acepol525252@gmail.com	ACEPOL525252@GMAIL.COM	acepol525252@gmail.com	ACEPOL525252@GMAIL.COM	f	argon2id$orWFicbjiYEMexonzqFm4g==$3mEx05c5uVGyyLErx/WNQHIvh+IUVXlTDe0F5OTclSM=	S5OZ3U27CQHMXS3IQVEQHRQ7DLFIO64U	0b524cef-4fe7-4616-939e-62598d06fe2c	\N	f	f	\N	t	0
e30a2ea2-9345-49ff-8834-852cd0ee8f9c	acepol1111111@gmail.com	ACEPOL1111111@GMAIL.COM	acepol1111111@gmail.com	ACEPOL1111111@GMAIL.COM	f	argon2id$WIzSR2joWC2j31Nv6nqTxQ==$Vu116A+epfvnUbjNEKNayKEBaQi3U0VGoNrdT3ZSQPQ=	NZXAIYT527TLGQBX7PBMET3T4THIONBO	f4b5d43f-17a2-499c-b3af-8b9c6cea4008	\N	f	f	\N	t	0
a6b502f4-ae09-4b25-b23b-f09490751136	acepol4441111@gmail.com	ACEPOL4441111@GMAIL.COM	acepol4441111@gmail.com	ACEPOL4441111@GMAIL.COM	f	argon2id$2xkg29Qri2sQ0M9XJX/Qpw==$wLtdVLZI07cCX+aSsOK1gHZurM0mrW/iSGvNAVwFBRI=	3O2N46Y3K3NH3OXENBEIAVSFYHCGNF4W	e8747b75-0fb2-4a90-bad7-14f7e8788023	\N	f	f	\N	t	0
dae153bc-4dc6-47f2-a38c-4ec51d15e5a6	acepol2211@gv.com	ACEPOL2211@GV.COM	acepol2211@gv.com	ACEPOL2211@GV.COM	f	argon2id$wa0vp03qcjpL6C5+QP7uxg==$6oopUr5HQtRuWiPU9WUJBjJ4GDlH6GKoJdreodq3BIQ=	CDUH2TN2ZVXITTJWL6CIINFHFE5UA5PZ	f444fbc4-23ac-4dcd-a4fe-63ba644180d6	\N	f	f	\N	t	0
9dc904af-e4ad-42a8-9c30-c3f8a9addb34	acepol999@gmail.com	ACEPOL999@GMAIL.COM	acepol999@gmail.com	ACEPOL999@GMAIL.COM	f	argon2id$KAKyq3wUO1OHk1V4Pf48VA==$7iBm9R+Cp3pkZ/8vnqRB4ydSpEn2lfxkKxk/4FaqEbg=	IAMNRLEQLGREZLYWDBM4STSM7R6MKBBW	cfa135c0-4c0f-4291-bc18-ca3af139aa5e	\N	f	f	\N	t	0
0f3ee4e6-87fe-4033-9d63-0860809e671a	acepol9911@gmail.com	ACEPOL9911@GMAIL.COM	acepol9911@gmail.com	ACEPOL9911@GMAIL.COM	f	argon2id$fAUMdm5swNfMrsS1MARbFw==$ae/R8lgaoVK/Nt9Wc5QMKBgxeC/Ou8iQi47LU8yySC0=	6MRT4IUA6I3L2AAFWC4AWB7XFZPWX2LH	510c530a-8caf-401b-ac3e-3cde9b758d8a	\N	f	f	\N	t	0
6d2cf8d8-f2b5-479f-bb18-f54128e8e228	acepol91911@gmail.com	ACEPOL91911@GMAIL.COM	acepol91911@gmail.com	ACEPOL91911@GMAIL.COM	f	argon2id$BnOMy3dQm9HUwwIBsZBBag==$uu2D/AQNvEtBN3mL0s/19tR794ghXlOlQGzfr21u06I=	4CXYNQO7VZST2SSGLOQ75YQJMOLAEGUX	e314af2f-4d86-4d11-b162-505904855ef2	\N	f	f	\N	t	0
305685ba-1e1b-4211-94d4-e2b51f38455a	acepol919111@gmail.com	ACEPOL919111@GMAIL.COM	acepol919111@gmail.com	ACEPOL919111@GMAIL.COM	f	argon2id$Cid/gJUmX440S+J71zvvXA==$po0QmMSIat+4bWT2VUmnvRlInX0cM1a0Hovjou2vRW8=	JUCTE7BKCZDDMCMGAAN25O6V7Z77LQVS	14d393c9-9500-42cc-9eb3-1761b72ad9c7	\N	f	f	\N	t	0
f6896952-1b61-499c-894b-804bb55616ed	acepol3@gmail.com	ACEPOL3@GMAIL.COM	acepol3@gmail.com	ACEPOL3@GMAIL.COM	f	argon2id$HC+GGEY5h5fcVhhjB7jvkQ==$C/24OOMve/FxAmNuxiAp4S1aWEg0oCZ4d44GVatbzQA=	YWZLFBHAPWT2LLYAFEDKNO6QDYCO34JT	59e16514-1045-4bca-8fb6-bfccd754761f	\N	f	f	\N	t	0
bf0beeab-3726-4a4d-b72d-733ef05785f0	acepol322@gmail.com	ACEPOL322@GMAIL.COM	acepol322@gmail.com	ACEPOL322@GMAIL.COM	f	argon2id$lMWGA/4xsI1oi2Kxs8iXZg==$cBkgVouZci374t4+xel2VQ/uac4wmtegdjODEM0RRXs=	XY6QT22OJ7I7STJ3ZMUUNQUZZY3FAMBH	cbe41772-55e5-493b-b0bd-df49e6346266	\N	f	f	\N	t	0
ef1ee5a5-689d-42c9-ac31-05970f0c571a	acepol991@gmail.com	ACEPOL991@GMAIL.COM	acepol991@gmail.com	ACEPOL991@GMAIL.COM	f	argon2id$G1dGf1K6bNvRCpkDAYjRWQ==$rW19i26/kGDaAZoNtLJvtnmzc9QA7GR43g64/oI5oT8=	UUSDE5THWJDOMLOF2U27GFWTD2CMAMYJ	ef32c155-8bf9-40c2-a04f-25f9a8309aaf	\N	f	f	\N	t	0
464fd5d7-520f-468f-ba05-489f863ac012	acepol9291@gmail.com	ACEPOL9291@GMAIL.COM	acepol9291@gmail.com	ACEPOL9291@GMAIL.COM	f	argon2id$iMSuDppH0QMLy3H7x8XncA==$s6F4ZG26WimxNZJixqnjMbvr5KqW+uSPpRDQSkcsdL0=	WNKHF3L5PVS6BRFRVVRLOML3LGTDF25Y	846817d8-40b6-46b1-8970-12da9ce51b21	\N	f	f	\N	t	0
468a193e-8e59-495e-979d-57f85466aeea	acepol91291@gmail.com	ACEPOL91291@GMAIL.COM	acepol91291@gmail.com	ACEPOL91291@GMAIL.COM	t	argon2id$GnqG9WV6SC7X2Yg9RfQQNQ==$m4PgHVXSVJQh7ZxjaKV6jd2KfVqmL5TzlbWfu8ZjtsI=	G62IAC54QHSGQOHA55MO5FWREH54UWGZ	5edd822b-207d-4492-bdcc-c0825a1315b1	\N	f	f	\N	t	0
2a07dde7-7245-4321-bcc6-d1eef10baf97	acepol2121@gamil.com	ACEPOL2121@GAMIL.COM	acepol2121@gamil.com	ACEPOL2121@GAMIL.COM	t	argon2id$ZkkXn0YZMUPiJULznYdZdg==$yAsRhg1cKyuxtGxCg8lb6R5RE7/ho66zE6xapvF4YX4=	GU2ALHCVVZZYJFPNJLIF664C3Q6HVN4K	a459c79b-4587-424b-910c-c221825e7042	\N	f	f	\N	t	0
abbebc65-0820-4fde-b377-11fbf6536eb5	readsssser@example.com	READSSSSER@EXAMPLE.COM	readsssser@example.com	READSSSSER@EXAMPLE.COM	t	argon2id$DfE3rn/pcS7sFNlp14160Q==$uVOVNFckNROB1Pv8PrL00+IWXkvWsB5sIWfNfEdeioU=	25QNSXHLJXCXQRS3DUY7QLNAPP6Y5537	d39f6b61-9bda-460c-8e0e-38671f228aa6	\N	f	f	\N	t	0
\.


--
-- Data for Name: Boards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Boards" ("Id", "PlayerId", "GameId", "Numbers") FROM stdin;
d4acf517-fdb9-4ec1-ada2-7c834fe6705e	e6740909-7516-4c46-af78-bf2684f36db4	1c08b8b6-98e7-4b82-901b-0a7abda21cb8	{12,90,19}
\.


--
-- Data for Name: Games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Games" ("Id", "StartDate", "EndDate", "WinningSequence") FROM stdin;
f196c7d1-cee5-4784-af83-ef375018e504	2024-11-17 22:00:39.277	2024-11-18 22:00:39.277	{0}
e9bcaed9-2290-49f7-a410-710f74e82084	2024-11-17 22:00:39.277	2025-01-18 22:00:39.277	{10}
1c08b8b6-98e7-4b82-901b-0a7abda21cb8	2024-11-17 22:00:39.277	2025-01-18 22:00:39.277	{10,1,18}
\.


--
-- Data for Name: Players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Players" ("Id", "UserId", "Name", "Balance", "IsActive") FROM stdin;
e6740909-7516-4c46-af78-bf2684f36db4	cf9cc290-ce4c-4d68-b1e8-88c58f7566ab	Andrii	10.00	t
f0c104d4-6b13-416a-b8ad-f80c4cf04443	abbebc65-0820-4fde-b377-11fbf6536eb5	SRT	0.00	t
\.


--
-- Data for Name: Transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transactions" ("Id", "PlayerId", "Amount", "TransactionDate", "MobilePayNumber") FROM stdin;
\.


--
-- Data for Name: Winners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Winners" ("Id", "PlayerId", "GameId", "WinningAmount") FROM stdin;
\.


--
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AspNetRoleClaims_Id_seq"', 1, false);


--
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AspNetUserClaims_Id_seq"', 1, false);


--
-- Name: Boards Boards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Boards"
    ADD CONSTRAINT "Boards_pkey" PRIMARY KEY ("Id");


--
-- Name: Games Games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Games"
    ADD CONSTRAINT "Games_pkey" PRIMARY KEY ("Id");


--
-- Name: AspNetRoleClaims PK_AspNetRoleClaims; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id");


--
-- Name: AspNetRoles PK_AspNetRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoles"
    ADD CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id");


--
-- Name: AspNetUserClaims PK_AspNetUserClaims; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id");


--
-- Name: AspNetUserLogins PK_AspNetUserLogins; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey");


--
-- Name: AspNetUserRoles PK_AspNetUserRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId");


--
-- Name: AspNetUserTokens PK_AspNetUserTokens; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name");


--
-- Name: AspNetUsers PK_AspNetUsers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUsers"
    ADD CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id");


--
-- Name: Players Players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Players"
    ADD CONSTRAINT "Players_pkey" PRIMARY KEY ("Id");


--
-- Name: Transactions Transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY ("Id");


--
-- Name: Winners Winners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Winners"
    ADD CONSTRAINT "Winners_pkey" PRIMARY KEY ("Id");


--
-- Name: EmailIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EmailIndex" ON public."AspNetUsers" USING btree ("NormalizedEmail");


--
-- Name: IX_AspNetRoleClaims_RoleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON public."AspNetRoleClaims" USING btree ("RoleId");


--
-- Name: IX_AspNetUserClaims_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserClaims_UserId" ON public."AspNetUserClaims" USING btree ("UserId");


--
-- Name: IX_AspNetUserLogins_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserLogins_UserId" ON public."AspNetUserLogins" USING btree ("UserId");


--
-- Name: IX_AspNetUserRoles_RoleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON public."AspNetUserRoles" USING btree ("RoleId");


--
-- Name: RoleNameIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RoleNameIndex" ON public."AspNetRoles" USING btree ("NormalizedName");


--
-- Name: UserNameIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserNameIndex" ON public."AspNetUsers" USING btree ("NormalizedUserName");


--
-- Name: Boards Boards_GameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Boards"
    ADD CONSTRAINT "Boards_GameId_fkey" FOREIGN KEY ("GameId") REFERENCES public."Games"("Id") ON DELETE CASCADE;


--
-- Name: Boards Boards_PlayerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Boards"
    ADD CONSTRAINT "Boards_PlayerId_fkey" FOREIGN KEY ("PlayerId") REFERENCES public."Players"("Id") ON DELETE CASCADE;


--
-- Name: AspNetRoleClaims FK_AspNetRoleClaims_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserClaims FK_AspNetUserClaims_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserLogins FK_AspNetUserLogins_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserTokens FK_AspNetUserTokens_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: Players Players_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Players"
    ADD CONSTRAINT "Players_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: Transactions Transactions_PlayerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_PlayerId_fkey" FOREIGN KEY ("PlayerId") REFERENCES public."Players"("Id") ON DELETE CASCADE;


--
-- Name: Winners Winners_GameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Winners"
    ADD CONSTRAINT "Winners_GameId_fkey" FOREIGN KEY ("GameId") REFERENCES public."Games"("Id") ON DELETE CASCADE;


--
-- Name: Winners Winners_PlayerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Winners"
    ADD CONSTRAINT "Winners_PlayerId_fkey" FOREIGN KEY ("PlayerId") REFERENCES public."Players"("Id") ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

