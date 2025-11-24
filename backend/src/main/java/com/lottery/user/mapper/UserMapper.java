package com.lottery.user.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.lottery.user.service.UserVO;

@Mapper
public interface UserMapper {

    // 회원 전체 목록
    List<UserVO> userList();

    // 단일 회원 조회
    UserVO getUser(String memId);

    // 회원 추가
    int insertUser(UserVO userVO);

    // 회원 수정
    int updateUser(UserVO userVO);

    // 회원 삭제
    int deleteUser(String memId);

    // 로그인용 (아이디 + 비밀번호)
    UserVO loginCheck(@Param("memId") String memId, @Param("memPwd") String memPwd);
}
