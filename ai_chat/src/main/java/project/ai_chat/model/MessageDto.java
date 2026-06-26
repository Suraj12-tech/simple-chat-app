package project.ai_chat.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {
  private String content;  // "user" ya "assistant"
  private String role;    // actual message text
}
