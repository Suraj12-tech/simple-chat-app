package project.ai_chat.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.ai_chat.model.ChatRequest;
import project.ai_chat.model.ChatResponse;
import project.ai_chat.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins ={"http://localhost:5173"})
public class Chat_Controller {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat (@RequestBody ChatRequest Request){
        ChatResponse response = chatService.chat(Request);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ChatResponse> handleChatError(Exception exception) {
        String message = exception.getMessage() == null
                ? "Backend error aaya."
                : exception.getMessage();
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ChatResponse(message));
    }
}
