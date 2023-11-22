Drop table if exists t_charge_info;
CREATE TABLE t_charge_info (
    id BIGSERIAL PRIMARY KEY,
    rid int not null,
    publisher_name VARCHAR(250) not null,
    voltage NUMERIC not null,
    current NUMERIC not null,
    power NUMERIC not null,
    datetime int64 not null,
    start_meter NUMERIC not null,
    end_meter NUMERIC not null,
    amount NUMERIC not null,
    total_amount NUMERIC not null,
    totol_secs NUMERIC not null,
    inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE t_charge_statistics (
    publisher_name VARCHAR(250) PRIMARY KEY,
    total_amount NUMERIC DEFAULT 0,
    consumed_amount NUMERIC DEFAULT 0,
    remaining_amount NUMERIC DEFAULT 0,
    inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);