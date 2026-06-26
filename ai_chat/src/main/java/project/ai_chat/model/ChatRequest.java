package project.ai_chat.model;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private List<MessageDto> messages;
}
