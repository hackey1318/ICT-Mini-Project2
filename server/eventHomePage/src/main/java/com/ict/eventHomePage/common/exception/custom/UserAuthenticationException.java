package com.ict.eventHomePage.common.exception.custom;

import org.springframework.security.core.AuthenticationException;

public class UserAuthenticationException extends AuthenticationException {

	public UserAuthenticationException(String msg) {
		super(msg);
	}

	public UserAuthenticationException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
