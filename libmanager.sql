PGDMP  "                
    |         
   libmanager    16.4    16.4 6    /           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            0           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            1           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            2           1262    107604 
   libmanager    DATABASE     �   CREATE DATABASE libmanager WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE libmanager;
                postgres    false            �            1259    107606    books    TABLE     |  CREATE TABLE public.books (
    book_id integer NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    isbn character varying(13) NOT NULL,
    genre character varying(100),
    publication_year integer,
    availability_status character varying(50) DEFAULT 'Available'::character varying,
    shelf_location character varying(50)
);
    DROP TABLE public.books;
       public         heap    postgres    false            �            1259    107605    books_book_id_seq    SEQUENCE     �   CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.books_book_id_seq;
       public          postgres    false    216            3           0    0    books_book_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;
          public          postgres    false    215            �            1259    107644    circulation    TABLE       CREATE TABLE public.circulation (
    transaction_id integer NOT NULL,
    book_id integer,
    user_id integer,
    issue_date date DEFAULT CURRENT_DATE,
    due_date date,
    return_date date,
    status character varying(50) DEFAULT 'Issued'::character varying
);
    DROP TABLE public.circulation;
       public         heap    postgres    false            �            1259    107643    circulation_transaction_id_seq    SEQUENCE     �   CREATE SEQUENCE public.circulation_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.circulation_transaction_id_seq;
       public          postgres    false    222            4           0    0    circulation_transaction_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.circulation_transaction_id_seq OWNED BY public.circulation.transaction_id;
          public          postgres    false    221            �            1259    107663    fines    TABLE     	  CREATE TABLE public.fines (
    fine_id integer NOT NULL,
    user_id integer,
    transaction_id integer,
    fine_amount numeric(10,2) NOT NULL,
    fine_date date DEFAULT CURRENT_DATE,
    fine_status character varying(50) DEFAULT 'Unpaid'::character varying
);
    DROP TABLE public.fines;
       public         heap    postgres    false            �            1259    107662    fines_fine_id_seq    SEQUENCE     �   CREATE SEQUENCE public.fines_fine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.fines_fine_id_seq;
       public          postgres    false    224            5           0    0    fines_fine_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.fines_fine_id_seq OWNED BY public.fines.fine_id;
          public          postgres    false    223            �            1259    107631 
   librarians    TABLE     |  CREATE TABLE public.librarians (
    librarian_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(15),
    address text,
    employment_date date DEFAULT CURRENT_DATE,
    role character varying(50) DEFAULT 'Staff'::character varying
);
    DROP TABLE public.librarians;
       public         heap    postgres    false            �            1259    107630    librarians_librarian_id_seq    SEQUENCE     �   CREATE SEQUENCE public.librarians_librarian_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.librarians_librarian_id_seq;
       public          postgres    false    220            6           0    0    librarians_librarian_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.librarians_librarian_id_seq OWNED BY public.librarians.librarian_id;
          public          postgres    false    219            �            1259    107682    notifications    TABLE     I  CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer,
    message text NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    type character varying(50) DEFAULT 'Reminder'::character varying,
    status character varying(50) DEFAULT 'Sent'::character varying
);
 !   DROP TABLE public.notifications;
       public         heap    postgres    false            �            1259    107681 !   notifications_notification_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.notifications_notification_id_seq;
       public          postgres    false    226            7           0    0 !   notifications_notification_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;
          public          postgres    false    225            �            1259    107618    users    TABLE       CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(15),
    address text,
    registration_date date DEFAULT CURRENT_DATE,
    account_status character varying(50) DEFAULT 'Active'::character varying
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    107617    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    218            8           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    217            i           2604    107609    books book_id    DEFAULT     n   ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);
 <   ALTER TABLE public.books ALTER COLUMN book_id DROP DEFAULT;
       public          postgres    false    216    215    216            q           2604    107647    circulation transaction_id    DEFAULT     �   ALTER TABLE ONLY public.circulation ALTER COLUMN transaction_id SET DEFAULT nextval('public.circulation_transaction_id_seq'::regclass);
 I   ALTER TABLE public.circulation ALTER COLUMN transaction_id DROP DEFAULT;
       public          postgres    false    221    222    222            t           2604    107666    fines fine_id    DEFAULT     n   ALTER TABLE ONLY public.fines ALTER COLUMN fine_id SET DEFAULT nextval('public.fines_fine_id_seq'::regclass);
 <   ALTER TABLE public.fines ALTER COLUMN fine_id DROP DEFAULT;
       public          postgres    false    223    224    224            n           2604    107634    librarians librarian_id    DEFAULT     �   ALTER TABLE ONLY public.librarians ALTER COLUMN librarian_id SET DEFAULT nextval('public.librarians_librarian_id_seq'::regclass);
 F   ALTER TABLE public.librarians ALTER COLUMN librarian_id DROP DEFAULT;
       public          postgres    false    219    220    220            w           2604    107685    notifications notification_id    DEFAULT     �   ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);
 L   ALTER TABLE public.notifications ALTER COLUMN notification_id DROP DEFAULT;
       public          postgres    false    226    225    226            k           2604    107621    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    217    218    218            "          0    107606    books 
   TABLE DATA           {   COPY public.books (book_id, title, author, isbn, genre, publication_year, availability_status, shelf_location) FROM stdin;
    public          postgres    false    216   NC       (          0    107644    circulation 
   TABLE DATA           r   COPY public.circulation (transaction_id, book_id, user_id, issue_date, due_date, return_date, status) FROM stdin;
    public          postgres    false    222   PF       *          0    107663    fines 
   TABLE DATA           f   COPY public.fines (fine_id, user_id, transaction_id, fine_amount, fine_date, fine_status) FROM stdin;
    public          postgres    false    224   mF       &          0    107631 
   librarians 
   TABLE DATA           ~   COPY public.librarians (librarian_id, first_name, last_name, email, phone_number, address, employment_date, role) FROM stdin;
    public          postgres    false    220   �F       ,          0    107682    notifications 
   TABLE DATA           a   COPY public.notifications (notification_id, user_id, message, sent_at, type, status) FROM stdin;
    public          postgres    false    226   �F       $          0    107618    users 
   TABLE DATA           �   COPY public.users (user_id, first_name, last_name, email, phone_number, address, registration_date, account_status) FROM stdin;
    public          postgres    false    218   �F       9           0    0    books_book_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.books_book_id_seq', 31, true);
          public          postgres    false    215            :           0    0    circulation_transaction_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.circulation_transaction_id_seq', 1, false);
          public          postgres    false    221            ;           0    0    fines_fine_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.fines_fine_id_seq', 1, false);
          public          postgres    false    223            <           0    0    librarians_librarian_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.librarians_librarian_id_seq', 1, false);
          public          postgres    false    219            =           0    0 !   notifications_notification_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);
          public          postgres    false    225            >           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);
          public          postgres    false    217            |           2606    107616    books books_isbn_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);
 >   ALTER TABLE ONLY public.books DROP CONSTRAINT books_isbn_key;
       public            postgres    false    216            ~           2606    107614    books books_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);
 :   ALTER TABLE ONLY public.books DROP CONSTRAINT books_pkey;
       public            postgres    false    216            �           2606    107651    circulation circulation_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.circulation
    ADD CONSTRAINT circulation_pkey PRIMARY KEY (transaction_id);
 F   ALTER TABLE ONLY public.circulation DROP CONSTRAINT circulation_pkey;
       public            postgres    false    222            �           2606    107670    fines fines_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.fines
    ADD CONSTRAINT fines_pkey PRIMARY KEY (fine_id);
 :   ALTER TABLE ONLY public.fines DROP CONSTRAINT fines_pkey;
       public            postgres    false    224            �           2606    107642    librarians librarians_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.librarians
    ADD CONSTRAINT librarians_email_key UNIQUE (email);
 I   ALTER TABLE ONLY public.librarians DROP CONSTRAINT librarians_email_key;
       public            postgres    false    220            �           2606    107640    librarians librarians_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.librarians
    ADD CONSTRAINT librarians_pkey PRIMARY KEY (librarian_id);
 D   ALTER TABLE ONLY public.librarians DROP CONSTRAINT librarians_pkey;
       public            postgres    false    220            �           2606    107692     notifications notifications_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public            postgres    false    226            �           2606    107629    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    218            �           2606    107627    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            �           2606    107652 $   circulation circulation_book_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.circulation
    ADD CONSTRAINT circulation_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);
 N   ALTER TABLE ONLY public.circulation DROP CONSTRAINT circulation_book_id_fkey;
       public          postgres    false    216    222    4734            �           2606    107657 $   circulation circulation_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.circulation
    ADD CONSTRAINT circulation_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 N   ALTER TABLE ONLY public.circulation DROP CONSTRAINT circulation_user_id_fkey;
       public          postgres    false    222    218    4738            �           2606    107676    fines fines_transaction_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.fines
    ADD CONSTRAINT fines_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.circulation(transaction_id);
 I   ALTER TABLE ONLY public.fines DROP CONSTRAINT fines_transaction_id_fkey;
       public          postgres    false    4744    224    222            �           2606    107671    fines fines_user_id_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.fines
    ADD CONSTRAINT fines_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 B   ALTER TABLE ONLY public.fines DROP CONSTRAINT fines_user_id_fkey;
       public          postgres    false    218    224    4738            �           2606    107693 (   notifications notifications_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 R   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_user_id_fkey;
       public          postgres    false    218    4738    226            "   �  x�uTKr� ^�S��@��Җ㸝��$��,��� ��z�^��d;!}�W����	����Fa�5�֩o}�k�>�N�y��P�T���Dd)��{����)��6rk��	�U��)�~;����6���Ǔr�4#�y��TdUFz�kDK&b<��]�퀗�ޡ�r��Z��6���@�7Յލ�E���U��"�9�Hw�$оR?X�&N�˲(�Z×N�� HVF\4�Ť���n�ú��pj�����M�R��Y�r��mڀԝ���ւ%�D�����}�}�h5��:��@E�n�H(O� �U�����=��b�i��D�ʺ��#G ��|F�;}���S��d�F�<��	���n�:�$/Y�X��y"���Ƀ�_��X�������F5�����}��o�,�X�҉�k�~Ժ��Q[�� G�]K��/R��"��d 7.K��@>A�4���lm��P�(,+�,G��֏�8>	V���|�11(��v�r���h%r��ZaAXB��;������v��9�I؀�[e��M�����Y�G��	��t������`w'Yp�SJJ�v���[����6��������^8ۅ_?O�0�挔�������%��PH}�k������^��(h{)D�_(��ǖ�BA��1�%n�K't�kX�F�F��3�8���q�K��UҘ�
mo��g�3��A����p�*���y�Y���_gI���ȓ�      (      x������ � �      *      x������ � �      &      x������ � �      ,      x������ � �      $      x������ � �     