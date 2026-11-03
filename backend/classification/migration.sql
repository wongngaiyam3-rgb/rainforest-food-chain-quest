create table public.fcq_classification_state (
 enrollment_id uuid primary key references public.fcq_enrollments(id),
 revision integer not null default 0,
 state jsonb not null,
 score integer not null default 0,
 submitted boolean not null default false,
 updated_at timestamptz not null default now()
);
create table public.fcq_classification_events (
 enrollment_id uuid not null references public.fcq_enrollments(id),
 event_id uuid not null,
 revision integer not null,
 state jsonb not null,
 score integer not null,
 submitted boolean not null,
 received_at timestamptz not null default now(),
 primary key(enrollment_id,event_id)
);
alter table public.fcq_classification_state enable row level security;
alter table public.fcq_classification_events enable row level security;
revoke all on public.fcq_classification_state, public.fcq_classification_events from anon,authenticated;
create function public.fcq_classification_save(p_id uuid,p_event uuid,p_revision integer,p_state jsonb,p_score integer,p_submitted boolean)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare current_revision integer; old_event record;
begin
 perform 1 from fcq_enrollments where id=p_id for update;
 select revision into old_event from fcq_classification_events where enrollment_id=p_id and event_id=p_event;
 if found then return jsonb_build_object('revision',old_event.revision,'duplicate',true); end if;
 select revision into current_revision from fcq_classification_state where enrollment_id=p_id;
 current_revision:=coalesce(current_revision,0);
 if current_revision<>p_revision then raise exception 'REVISION_CONFLICT'; end if;
 insert into fcq_classification_events(enrollment_id,event_id,revision,state,score,submitted) values(p_id,p_event,current_revision+1,p_state,p_score,p_submitted);
 insert into fcq_classification_state(enrollment_id,revision,state,score,submitted) values(p_id,current_revision+1,p_state,p_score,p_submitted)
 on conflict(enrollment_id) do update set revision=excluded.revision,state=excluded.state,score=excluded.score,submitted=excluded.submitted,updated_at=now();
 return jsonb_build_object('revision',current_revision+1,'received_at',now());
end;$$;
revoke all on function public.fcq_classification_save(uuid,uuid,integer,jsonb,integer,boolean) from public,anon,authenticated;
grant execute on function public.fcq_classification_save(uuid,uuid,integer,jsonb,integer,boolean) to service_role;
