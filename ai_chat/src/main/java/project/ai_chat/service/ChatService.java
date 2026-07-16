package project.ai_chat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import project.ai_chat.model.ChatRequest;
import project.ai_chat.model.ChatResponse;
import project.ai_chat.model.MessageDto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String GEMINI_URL_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent";

    public ChatResponse chat(ChatRequest chatRequest) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("GEMINI_API_KEY set nahi hai.");
        }

        List<Map<String, Object>> contents = buildContents(chatRequest);

        Map<String, Object> requestBody = new HashMap<>();

        Map<String, Object> systemInstruction = new HashMap<>();

        Map<String, String> systemPart = new HashMap<>();
        systemPart.put("text",
                "You are a helpful and friendly AI assistant. Keep answers concise.");

        List<Map<String, String>> systemParts = new ArrayList<>();
        systemParts.add(systemPart);

        systemInstruction.put("parts", systemParts);

        requestBody.put("systemInstruction", systemInstruction);

        requestBody.put("contents", contents);

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("maxOutputTokens", 500);
        generationConfig.put("temperature", 0.7);

        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        geminiUrl(),
                        request,
                        Map.class
                );

        String reply = extractReply(response.getBody());

        ChatResponse chatResponse = new ChatResponse(reply);

        return chatResponse;
    }

    private String geminiUrl() {
        return String.format(GEMINI_URL_TEMPLATE, model);
    }

    private List<Map<String, Object>> buildContents(ChatRequest chatRequest) {

        List<Map<String, Object>> contents = new ArrayList<>();

        if (chatRequest.getMessages() == null) {
            return contents;
        }

        boolean sawUserMessage = false;

        for (MessageDto msg : chatRequest.getMessages()) {

            if (msg.getRole() == null || msg.getRole().isEmpty()) {
                continue;
            }

            if (msg.getContent() == null || msg.getContent().isEmpty()) {
                continue;
            }

            String role = msg.getRole();

            String geminiRole;

            if (role.equals("assistant")) {
                geminiRole = "model";
            } else {
                geminiRole = "user";
            }


            if (role.equals("user")) {
                sawUserMessage = true;
            }

            if (sawUserMessage) {

                Map<String, String> part = new HashMap<>();
                part.put("text", msg.getContent());

                List<Map<String, String>> parts = new ArrayList<>();
                parts.add(part);

                Map<String, Object> message = new HashMap<>();
                message.put("role", geminiRole);
                message.put("parts", parts);

                contents.add(message);
            }
        }

        if (contents.isEmpty()) {
            throw new IllegalArgumentException("Message empty hai.");
        }

        return contents;
    }

    private String extractReply(Map<String, Object> responseBody) {

        if (responseBody == null) {
            throw new IllegalStateException("Gemini se invalid response aaya.");
        }

        List<?> candidates = (List<?>) responseBody.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini se invalid response aaya.");
        }

        Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);

        Map<?, ?> content = (Map<?, ?>) candidate.get("content");

        if (content == null) {
            throw new IllegalStateException("Content nahi mila.");
        }

        List<?> parts = (List<?>) content.get("parts");

        if (parts == null || parts.isEmpty()) {
            throw new IllegalStateException("Parts nahi mile.");
        }

        StringBuilder reply = new StringBuilder();

        for (Object obj : parts) {

            Map<?, ?> part = (Map<?, ?>) obj;

            String text = (String) part.get("text");

            if (text != null && !text.isBlank()) {
                reply.append(text);
            }
        }

        if (reply.isEmpty()) {
            throw new IllegalStateException("Gemini se empty response aaya.");
        }

        return reply.toString();
    }
}


//{
//        "candidates": [
//        {
//        "content": {
//        "parts": [
//        { "text": "answer here" }
//        ]
//        }
//        }
//        ]
//        }