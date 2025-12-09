-- 유저 테이블
create table member 
(
    member_id   varchar2(20)    not null    primary key,
    member_pw   varchar2(20)    not null,
    member_nm   varchar2(20)    not null,
    nick_nm     varchar2(20)    not null,
    create_date DATE            Default sysdate
);

-- 영화 정보 테이블
create table mv_info
(
    mv_no       NUMBER(5)       not null,
    mv_title    varchar2(200)   not null,
    mv_genre    varchar2(10)    not null,
    rel_date    DATE            not null
);

-- 게시물 테이블
-- mv_genre 넘버 지정
create table rvboard
(
    board_no        NUMBER(5)       not null    primary key,
    member_id       varchar2(20)    not null    foreign key member(member_id),
    board_title     varchar2(100)   not null,
    baard_content   varchar2(4000)  not null,
    mv_no           NUMBER(5)       not null    foreign key mv_info(mv_no),
    -- mv_genre        NUMBER(3)       not null    foreign key mv_info(mv_genre)
);

-- 댓글 테이블

-- 개인 페이지 테이블 (댓글 게시글 id)