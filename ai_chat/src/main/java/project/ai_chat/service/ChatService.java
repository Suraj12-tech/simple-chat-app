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
        if (!StringUtils.hasText(apiKey)) {
            throw new IllegalStateException("GEMINI_API_KEY set nahi hai.");
        }

        List<Map<String, Object>> contents = buildContents(chatRequest); //<------------ baad me --------

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("systemInstruction", Map.of(
                "parts", List.of(Map.of(
                        "text", "You are a helpful and friendly AI assistant. Keep answers concise."
                ))
        ));
        requestBody.put("contents", contents);
        requestBody.put("generationConfig", Map.of(
                "maxOutputTokens", 500,
                "temperature", 0.7
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(geminiUrl(), entity, Map.class);

        return new ChatResponse(extractReply(response.getBody()));
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
            if (!StringUtils.hasText(msg.getRole()) || !StringUtils.hasText(msg.getContent())) {
                continue;
            }

            String role = msg.getRole();
//            if (!role.equals("user") && !role.equals("assistant")) {
//                continue;
//            }

            String geminiRole = role.equals("assistant") ? "model" : "user";
            if (role.equals("user")) {
                sawUserMessage = true;
            }

            if (sawUserMessage) {
                contents.add(Map.of(
                        "role", geminiRole,
                        "parts", List.of(Map.of("text", msg.getContent()))
                ));
            }
        }

        if (contents.isEmpty()) {
            throw new IllegalArgumentException("Message empty hai.");
        }

        return contents;
    }

    private String extractReply(Map responseBody) {
        if (responseBody == null || !(responseBody.get("candidates") instanceof List<?> candidates)
                || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini se invalid response aaya.");
        }

        Object firstCandidate = candidates.getFirst();
        if (!(firstCandidate instanceof Map<?, ?> candidate)
                || !(candidate.get("content") instanceof Map<?, ?> content)
                || !(content.get("parts") instanceof List<?> parts)) {
            Object finishReason = firstCandidate instanceof Map<?, ?> candidateMap
                    ? candidateMap.get("finishReason")
                    : null;
            throw new IllegalStateException("Gemini se text response nahi aaya."
                    + (finishReason == null ? "" : " Finish reason: " + finishReason));
        }

        StringBuilder reply = new StringBuilder();
        for (Object part : parts) {
            if (part instanceof Map<?, ?> partMap && partMap.get("text") instanceof String text) {
                reply.append(text);
            }
        }

        if (!StringUtils.hasText(reply)) {
            throw new IllegalStateException("Gemini se empty response aaya.");
        }

        return reply.toString();
    }
}
