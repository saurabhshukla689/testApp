from google.cloud import translate_v2 as translate

# Initialize the client
translate_client = translate.Client()

def translate_text(text, target_language="hi"):
    if isinstance(text, bytes):
        text = text.decode("utf-8")

    result = translate_client.translate(text, target_language=target_language)

    print("Original:", result["input"])
    print("Translated:", result["translatedText"])
    print("Detected Source Language:", result["detectedSourceLanguage"])
    return result["translatedText"]

# Example
# translated = translate_text("Where is the train station?", target_language="hi")
