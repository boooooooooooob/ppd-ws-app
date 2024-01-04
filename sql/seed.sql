Drop table if exists t_charge_info;
CREATE TABLE t_charge_info (
    id BIGSERIAL PRIMARY KEY,
    rid int not null,
    publisher_name VARCHAR(250) not null,
    ua NUMERIC not null,
    ub NUMERIC not null,
    uc NUMERIC not null,
    ia NUMERIC not null,
    ib NUMERIC not null,
    ic NUMERIC not null,
    pa NUMERIC not null,
    pb NUMERIC not null,
    pc NUMERIC not null,
    datetime NUMERIC not null,
    start_meter NUMERIC not null,
    end_meter NUMERIC not null,
    amount NUMERIC not null,
    total_amount NUMERIC not null,
    total_secs NUMERIC not null,
    times NUMERIC not null,
    inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

Drop table if exists t_charge_session_statistics;
CREATE TABLE t_charge_session_statistics (
    id BIGSERIAL PRIMARY KEY,
    publisher_name VARCHAR(250) not null,
    session_id INT not null,
    total_amount NUMERIC DEFAULT 0,
    total_secs NUMERIC DEFAULT 0,
    inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    constraint charge_session_statistics_unq unique (publisher_name, session_id)
);

Drop table if exists t_charge_statistics;
CREATE TABLE t_charge_statistics (
    publisher_name VARCHAR(250) PRIMARY KEY,
    total_amount NUMERIC DEFAULT 0,
    total_secs NUMERIC DEFAULT 0,
    consumed_amount NUMERIC DEFAULT 0,
    remaining_amount NUMERIC DEFAULT 0,
    inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE t_locate_info (
    id BIGSERIAL PRIMARY KEY,
    publisher_name VARCHAR(250) not null,
    long NUMERIC not null,
    lat NUMERIC not null,
    alt NUMERIC not null,
    inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);