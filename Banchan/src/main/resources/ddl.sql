use banchan;

create table apt
(
    apt_code       varchar(50)  not null
        primary key,
    addr           varchar(255) not null,
    apartment_name varchar(255) not null,
    total_units    int          null
);

create table conf_room
(
    conf_room_id   bigint auto_increment
        primary key,
    created_at     datetime(6)          not null,
    is_active      tinyint(1) default 0 null,
    recording_path varchar(255)         null,
    room_name      varchar(255)         not null,
    session        varchar(255)         null,
    start_date     varchar(255)         not null,
    start_time     varchar(255)         not null,
    conf_summury   text                 null,
    apt_code       varchar(50)          not null,
    constraint FKrqg0yhqs9meu8f0dashk9b6j5
        foreign key (apt_code) references apt (apt_code)
);

create table conf_participant
(
    room_id bigint not null
        primary key,
    constraint FKb6nax0b6pnng0d6w7mcj0oqp1
        foreign key (room_id) references conf_room (conf_room_id)
);

create table users
(
    user_id       bigint auto_increment
        primary key,
    attribute_key varchar(255)                             null,
    created_at    datetime(6)                              null,
    email         varchar(255)                             not null,
    password_hash varchar(255)                             not null,
    phone         varchar(50)                              null,
    realname      varchar(50)                              null,
    role          enum ('ADMIN', 'BUILDING_ADMIN', 'USER') not null,
    social_type   varchar(255)                             null,
    updated_at    datetime(6)                              null,
    username      varchar(50)                              not null
);

create table ask
(
    ask_id     bigint auto_increment
        primary key,
    content    text          not null,
    created_at datetime(6)   null,
    title      varchar(255)  not null,
    updated_at datetime(6)   null,
    views      int default 0 null,
    apt_code   varchar(50)   not null,
    user_id    bigint        not null,
    constraint FK58r0a6y2qvypf48iyqfrvhws5
        foreign key (apt_code) references apt (apt_code),
    constraint FKfora7a21oyqtq19y1kf39heqc
        foreign key (user_id) references users (user_id)
);

create table ask_comment
(
    ask_comment_id bigint auto_increment
        primary key,
    content        text        not null,
    created_at     datetime(6) not null,
    updated_at     datetime(6) not null,
    ask_id         bigint      not null,
    user_id        bigint      not null,
    constraint FKhk2f0lkcwf98fx0785kttechg
        foreign key (ask_id) references ask (ask_id),
    constraint FKmh24g79tf1stpdmcxkgyfpyqg
        foreign key (user_id) references users (user_id)
);

create table ask_img
(
    ask_img_id bigint auto_increment
        primary key,
    image_url  varchar(255) null,
    ask_id     bigint       not null,
    constraint FKfai3x8809c9ig1vndb90o8ipr
        foreign key (ask_id) references ask (ask_id)
);

create table ask_like
(
    ask_id  bigint not null,
    user_id bigint not null,
    primary key (ask_id, user_id),
    constraint FKguvh8qt1xk1gx0gcwbgcpxbqn
        foreign key (user_id) references users (user_id),
    constraint FKl3q6ld5yb5030e5tkbhiwd20v
        foreign key (ask_id) references ask (ask_id)
);

create table notice
(
    notice_id  bigint auto_increment
        primary key,
    content    text                               not null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    title      varchar(255)                       not null,
    updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    views      int      default 0                 not null,
    apt_code   varchar(50)                        not null,
    user_id    bigint                             not null,
    constraint FK6hu3mfrsmpbqjk44w2fq5t5us
        foreign key (user_id) references users (user_id),
    constraint FKh2mnx8xl5bpefd98oboa32cbe
        foreign key (apt_code) references apt (apt_code)
);

create table notice_comment
(
    notice_comment_id bigint auto_increment
        primary key,
    content           varchar(255) not null,
    created_at        datetime(6)  not null,
    updated_at        datetime(6)  not null,
    notice_id         bigint       not null,
    user_id           bigint       not null,
    constraint FK6ejye0l2wevu2cwcdodeif716
        foreign key (user_id) references users (user_id),
    constraint FKax7qcww5twiq84y8dvvpaketx
        foreign key (notice_id) references notice (notice_id)
);

create table notice_img
(
    notice_img_id     bigint auto_increment
        primary key,
    image_url         varchar(255) not null,
    original_filename varchar(255) not null,
    stored_filename   varchar(255) not null,
    notice_id         bigint       not null,
    constraint FKflgmvn9j5ynswpueyqqthos2e
        foreign key (notice_id) references notice (notice_id)
);

create table user_apt
(
    user_apt_id int auto_increment
        primary key,
    building_no varchar(50) not null,
    is_granted  bit         not null,
    unit_no     varchar(50) not null,
    apt_code    varchar(50) not null,
    user_id     bigint      not null,
    constraint FKg87spu1tilg53r1hk36xnhqtk
        foreign key (apt_code) references apt (apt_code),
    constraint FKnpllq547dvv4oo466e01tq7pm
        foreign key (user_id) references users (user_id)
);

create table vote
(
    vote_id      bigint auto_increment
        primary key,
    content      varchar(255) not null,
    created_at   datetime(6)  not null,
    end_date     date         not null,
    image_url    varchar(255) null,
    is_active    bit          null,
    start_date   date         not null,
    title        varchar(255) not null,
    apt_code     varchar(50)  not null,
    created_user bigint       not null,
    constraint FKfn08ih9y80c9ax6txtxn1eyei
        foreign key (apt_code) references apt (apt_code),
    constraint FKml69xjfk6wv2c0mx6ord8ds5q
        foreign key (created_user) references users (user_id)
);

create table vote_participant
(
    is_voted tinyint(1) default 1 null,
    user_id  bigint               not null,
    vote_id  bigint               not null,
    primary key (user_id, vote_id),
    constraint FK8v611tho31tvbplr6k35uu6qt
        foreign key (vote_id) references vote (vote_id),
    constraint FKtnmxnmmoioo4tdh2buh7hg10u
        foreign key (user_id) references users (user_id)
);

create table vote_question
(
    vote_question_id bigint auto_increment
        primary key,
    question_text    varchar(255) not null,
    vote_id          bigint       not null,
    constraint FKiw5jby5bhcox8hqbsngbscmi4
        foreign key (vote_id) references vote (vote_id)
);

create table vote_option
(
    vote_option_id bigint auto_increment
        primary key,
    option_text    varchar(255) not null,
    question_id    bigint       not null,
    constraint FKbqkrtmcddp6afvsnbbbxv6j1u
        foreign key (question_id) references vote_question (vote_question_id)
);

create table vote_res
(
    vote_res_id bigint auto_increment
        primary key,
    vote_date   datetime(6) null,
    user_id     bigint      null,
    vote_id     bigint      null,
    option_id   bigint      null,
    question_id bigint      null,
    constraint FK6y14psxr835yqy1ufxttqgvcr
        foreign key (user_id) references users (user_id),
    constraint FKnafx5fwhae0egulgrifcyfiau
        foreign key (vote_id) references vote (vote_id),
    constraint FKp5rjg1vmb52bw2di6xr3euykd
        foreign key (question_id) references vote_question (vote_question_id),
    constraint FKp74hi609gj256we4cw21utwbq
        foreign key (option_id) references vote_option (vote_option_id)
);