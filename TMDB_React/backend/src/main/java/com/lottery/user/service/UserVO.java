package com.lottery.user.service;

import lombok.Data;

@Data
public class UserVO {
    private Long memNo;
    private String memName;
    private String memPhone;
    private String memId;
    private String memPwd;
    private String memReg;
    private String memBirth;
    private String memRank;
}
