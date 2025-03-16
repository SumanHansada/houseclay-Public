package com.houseclay.backend.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class APIException extends Exception {

    private HttpStatus code;

    public APIException(String m, HttpStatus code) {
        super(m);
        this.code = code;
    }
}