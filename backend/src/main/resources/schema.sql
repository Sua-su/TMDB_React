CREATE TABLE IF NOT EXISTS rvboard (
    board_no INTEGER PRIMARY KEY,
    member_id TEXT NOT NULL,
    board_title TEXT NOT NULL,
    board_content TEXT NOT NULL,
    mv_no INTEGER NOT NULL,
    reg_date TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
);
