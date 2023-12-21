Drop table if exists t_charge_info;
CREATE TABLE t_charge_info (
    id BIGSERIAL PRIMARY KEY,
    rid int not null,
    publisher_name VARCHAR(250) not null,
    voltage NUMERIC not null,
    current NUMERIC not null,
    power NUMERIC not null,
    datetime NUMERIC not null,
    start_meter NUMERIC not null,
    end_meter NUMERIC not null,
    amount NUMERIC not null,
    total_amount NUMERIC not null,
    totol_secs NUMERIC not null,
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
    totol_secs NUMERIC DEFAULT 0,
    inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    constraint charge_session_statistics_unq unique (publisher_name, session_id)
);

Drop table if exists t_charge_statistics;
CREATE TABLE t_charge_statistics (
    publisher_name VARCHAR(250) PRIMARY KEY,
    total_amount NUMERIC DEFAULT 0,
    totol_secs NUMERIC DEFAULT 0,
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