package project.ai_chat.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {
  private String role;    // "user" ya "assistant"
  private String content; // actual message text
}
