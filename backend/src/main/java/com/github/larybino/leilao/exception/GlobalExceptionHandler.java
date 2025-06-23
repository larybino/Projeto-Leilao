package com.github.larybino.leilao.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.github.larybino.leilao.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> notFoundException(NotFoundException ex, WebRequest request){
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(),
        "Not Found",
        ex.getMessage(),
        request.getDescription(false),
        null
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> global(Exception ex, WebRequest request){
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "Internal Server Error", 
        ex.getMessage(),
        request.getDescription(false),
        null
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
        
    
    
}
