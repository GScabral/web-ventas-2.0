ALTER TABLE public.oferta ALTER COLUMN id_oferta SET DEFAULT nextval('oferta_id_oferta_seq'::regclass);
