create extension if not exists vector;

create table if not exists documents (
  id bigserial primary key,
  tenant_id text not null default 'default',
  title text not null,
  source text not null default 'manual',
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_documents_tenant_created
  on documents(tenant_id, created_at desc);
