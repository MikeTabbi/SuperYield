import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '@env';
import { Ionicons } from '@expo/vector-icons';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const TypingDots = () => {
  const animations = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];

  animations.forEach((anim, i) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(i * 150),
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  });

  return (
    <View style={styles.dotsContainer}>
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -3],
                  }),
                },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

export default function Chat() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });

    return () => keyboardListener.remove();
  }, []);

  const convertToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSend = async () => {
    if (!input && !image) return;

    setMessages(prev => [...prev, { text: input || 'Analyzing image...', sender: 'user' }]);
    scrollRef.current?.scrollToEnd({ animated: true });
    setLoading(true);

    try {
      let response;

      if (image) {
        const base64 = await convertToBase64(image);
        response = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: 'You are a plant doctor. Analyze the image and provide diagnosis.' },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this plant:' },
                { type: 'image_url', image_url: { url: base64 } },
              ],
            },
          ],
          max_tokens: 1000,
        });
      } else {
        response = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: 'You are a plant doctor. Provide concise advice.' },
            { role: 'user', content: input },
          ],
        });
      }

      setMessages(prev => [
        ...prev,
        {
          text: response.choices[0]?.message?.content || 'No response',
          sender: 'bot',
        },
      ]);
      scrollRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { text: 'Error analyzing request', sender: 'bot' }]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }

    setInput('');
    setImage(null);
    setLoading(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, i) => (
              <View
                key={i}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={msg.sender === 'user' ? styles.userText : styles.botText}>{msg.text}</Text>
              </View>
            ))}

            {loading && (
              <View style={styles.botBubble}>
                <TypingDots />
              </View>
            )}
          </ScrollView>

          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

          <View style={styles.inputBar}>
            <Pressable onPress={pickImage}>
              <Ionicons name="image-outline" size={26} color="#4CAF50" style={styles.icon} />
            </Pressable>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              underlineColorAndroid="transparent"
            />
            <Pressable onPress={handleSend}>
              <Ionicons name="send" size={22} color="#4CAF50" style={styles.icon} />
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messages: { flex: 1, paddingHorizontal: 10 },
  messageBubble: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#D4F8A2',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userText: {
    fontSize: 16,
    color: '#000',
  },
  botText: {
    fontSize: 16,
    color: '#333',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: '#000',
  },
  icon: {
    paddingHorizontal: 6,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingLeft: 8,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginHorizontal: 2,
  },
});
