package com.TMDB.user.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

import com.TMDB.user.mapper.UserMapper;
// import com.TMDB.user.service.UserService;
import com.TMDB.user.service.UserVO;

// @Service
// MyBatis용 UserService - 현재 JPA UserAuthService 사용 중이므로 비활성화
public class UserServiceImpl /* implements UserService */ {

    @Autowired
    private UserMapper userMapper;

    // @Override
    public List<UserVO> userList() {
        return userMapper.userList();
    }

    // @Override
    public UserVO getUser(String memId) {
        System.out.println("🟢 [Service] getUser() 호출: memId = " + memId);
        return userMapper.getUser(memId);
    }

    // @Override
    public int insertUser(UserVO userVO) {
        return userMapper.insertUser(userVO);
    }

    // @Override
    public int updateUser(UserVO userVO) {
        return userMapper.updateUser(userVO);
    }

    // @Override
    public int deleteUser(String memId) {
        return userMapper.deleteUser(memId);
    }

    // @Override
    public UserVO loginCheck(String memId, String memPwd) {
        System.out.println("🟡 [Service] loginCheck() 호출: memId=" + memId + ", memPwd=" + memPwd);
        return userMapper.loginCheck(memId, memPwd);
    }
}
