PGDMP  &                    }            MYAU    17.4    17.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    17055    MYAU    DATABASE     l   CREATE DATABASE "MYAU" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'ru-RU';
    DROP DATABASE "MYAU";
                     postgres    false            �            1259    17069    orders    TABLE     �   CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    order_data jsonb NOT NULL,
    name text,
    lastname text,
    phone text,
    address text,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.orders;
       public         heap r       postgres    false            �            1259    17068    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public               postgres    false    220            �           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public               postgres    false    219            �            1259    17057    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    registration_date timestamp without time zone DEFAULT now()
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    17056    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            (           2604    17072 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            &           2604    17060    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            �          0    17069    orders 
   TABLE DATA           e   COPY public.orders (id, user_id, order_data, name, lastname, phone, address, created_at) FROM stdin;
    public               postgres    false    220   T       �          0    17057    users 
   TABLE DATA           V   COPY public.users (id, username, email, password_hash, registration_date) FROM stdin;
    public               postgres    false    218   w       �           0    0    orders_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.orders_id_seq', 3, true);
          public               postgres    false    219            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 5, true);
          public               postgres    false    217            /           2606    17077    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public                 postgres    false    220            +           2606    17067    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            -           2606    17065    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            0           2606    17078    orders orders_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_fkey;
       public               postgres    false    220    218    4653            �     x����JA��٧�N����d_E-D,,� ��:QQ	��Hb`�l�羑w�R�00�{�ùg��b�<>9�ĹL2>�=��g�w�|f��k,b��셖s�ې2�<_�s� s�(��@!��X�2k�׵�OQP�q�Ḵ��겙�*ƫ���h@���0	.��D���X��Z��+�2L��k*�L�T.Omnm�T�2�� �0�+�Ϭ�Y��_����
4�����P��P`�b|�f�%�[�p�mt��DQ���      �   �   x�]��N�@ ��3<�����PN"-�T@%&^:�����Oo�M�?��CҐ�ò��|)�u�,������`Mn4Fg��#�?Z�;&i�`U�ZGo�Z9|U��T7�=A�?"@�1U���'e�lm�|��$�ڽ�ߚα���Ľ]�%u��w��,�u�D��p�E�N�L�*���7S�lm����.6�߶2�N�ټ�#��Hijewᔁ�>y?~U�,�#�c�a��dY���\�     