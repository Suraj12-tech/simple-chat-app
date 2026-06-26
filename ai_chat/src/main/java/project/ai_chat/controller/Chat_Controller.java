package project.ai_chat.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.ai_chat.model.ChatRequest;
import project.ai_chat.model.ChatResponse;
import project.ai_chat.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins ="http://localhost:3000")
public class Chat_Controller {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat (@RequestBody ChatRequest Request){
        ChatResponse response = chatService.chat(Request);
        return ResponseEntity.ok(response);
    }
}
