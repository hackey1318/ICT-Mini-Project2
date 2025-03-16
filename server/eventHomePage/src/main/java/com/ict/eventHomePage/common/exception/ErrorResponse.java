package com.ict.eventHomePage.common.exception;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

	private ErrorCode errorCode;
	private String errorMsg;
}
