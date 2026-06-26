package project.ai_chat.service;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import project.ai_chat.model.ChatRequest;
import project.ai_chat.model.ChatResponse;
import project.ai_chat.model.MessageDto;
import org.springframework.http.HttpHeaders;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class ChatService {

  //application.properties se API key read karta hai
    @Value("${openai.api.key}")
    private String apikey;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String OPENAI_URL ="https://api.openai.com/v1/chat/completions";

    public ChatResponse chat (ChatRequest chatRequest){

        // Step 1: Messages list banao
        // Pehle system message daalo (AI ka behavior define karta hai)
        List<Map<String,String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", "You are a helpful and friendly AI assistant. Keep answers concise."
        ));

        // Frontend se aaye saare messages add karo
        for(MessageDto msg : chatRequest.getMessages()){
            messages.add(Map.of("role",msg.getRole(),"content",msg.getContent()));
        }

        // Step 2: OpenAI ke liye request body banao
        Map<String,Object> requestBody = new HashMap<>();
        requestBody.put("model","gpt-3.5-turbo");
        requestBody.put("messages",messages);
        requestBody.put("max_token",500);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apikey);

        HttpEntity<Map<String,Object>> entity = new  HttpEntity<>(requestBody,headers);

        // Step 4: OpenAI API call karo
        ResponseEntity<Map>reponse = restTemplate.postForEntity(
                OPENAI_URL,entity,Map.class
        );

        List<Map<String,Object>> choices = (List<Map<String,Object>>) reponse.getBody().get("choices");

        Map<String,Object> message = (Map<String,Object>) choices.get(0).get("message");

        String reply = (String) message.get("content");

        return new ChatResponse(reply);

    }



}
