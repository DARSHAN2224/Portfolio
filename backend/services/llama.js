import axios from 'axios';
import { config } from '../config/index.js';
import { DARSHAN_SYSTEM_PROMPT } from '../config/systemPrompt.js';

/**
 * Llama AI Service Client
 * Supports multiple Llama providers: Ollama, Together AI, Groq, etc.
 */
class LlamaService {
  constructor() {
    this.apiUrl = config.llama.apiUrl;
    this.model = config.llama.model;
    this.apiKey = config.llama.apiKey;
    this.timeout = config.requestTimeout;
  }

  /**
   * Generate response from Llama model
   * @param {string} userMessage - User input message
   * @param {object} context - Optional context data (projects, skills, etc.)
   * @returns {object} { response, command }
   */
  async chat(userMessage, context = {}) {
    try {
      // Build prompt with system message and context
      const prompt = this._buildPrompt(userMessage, context);

      // Determine which provider to use based on API URL
      let response;
      if (this.apiUrl.includes('localhost') || this.apiUrl.includes('11434')) {
        // Ollama local
        response = await this._queryOllama(prompt);
      } else if (this.apiUrl.includes('together')) {
        // Together AI
        response = await this._queryTogetherAI(prompt);
      } else if (this.apiUrl.includes('groq')) {
        // Groq
        response = await this._queryGroq(prompt);
      } else if (this.apiUrl.includes('huggingface')) {
        // Hugging Face Inference API
        response = await this._queryHuggingFace(prompt);
      } else {
        // Generic endpoint
        response = await this._queryGeneric(prompt);
      }

      // Parse response for command
      const { text, command } = this._parseResponse(response);

      return {
        response: text,
        command: command || null,
      };
    } catch (error) {
      console.error('[LLAMA ERROR]', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Build prompt with system context and user message
   */
  _buildPrompt(userMessage, context) {
    let prompt = DARSHAN_SYSTEM_PROMPT + '\n\n';

    // Add context data if provided
    if (context.projects?.length) {
      prompt += `AVAILABLE PROJECTS:\n`;
      context.projects.forEach((p) => {
        prompt += `- ${p.title} (${p.domain}): ${p.description}\n`;
      });
      prompt += '\n';
    }

    if (context.skills?.length) {
      prompt += `SYSTEM CAPABILITIES:\n`;
      context.skills.forEach((s) => {
        prompt += `- ${s.name} (${s.category}, Level ${s.proficiency}/5)\n`;
      });
      prompt += '\n';
    }

    if (context.profile) {
      prompt += `SYSTEM PROFILE:\n${context.profile.name} - ${context.profile.title}\n${context.profile.bio}\n\n`;
    }

    prompt += `USER: ${userMessage}\nASSISTANT:`;
    return prompt;
  }

  /**
   * Query Ollama local instance
   */
  async _queryOllama(prompt) {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        prompt: prompt,
        stream: false,
        temperature: 0.7,
      },
      { timeout: this.timeout }
    );

    return response.data.response;
  }

  /**
   * Query Together AI
   */
  async _queryTogetherAI(prompt) {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        max_tokens: 1024,
        prompt: prompt,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        timeout: this.timeout,
      }
    );

    return response.data.output.choices[0].text;
  }

  /**
   * Query Groq
   */
  async _queryGroq(prompt) {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: DARSHAN_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: prompt.split('USER: ')[1],
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        timeout: this.timeout,
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Query Hugging Face Inference API
   */
  async _queryHuggingFace(prompt) {
    const response = await axios.post(
      this.apiUrl,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.timeout,
      }
    );

    // Hugging Face returns array of generated text objects
    if (Array.isArray(response.data)) {
      return response.data[0].generated_text || response.data[0].text;
    }
    return response.data.generated_text || response.data[0]?.generated_text || '';
  }

  /**
   * Generic query for other providers
   */
  async _queryGeneric(prompt) {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        prompt: prompt,
        temperature: 0.7,
      },
      {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        timeout: this.timeout,
      }
    );

    // Try to extract text from various response formats
    return response.data.response || response.data.text || response.data.output;
  }

  /**
   * Parse response to extract command if present
   * Command format: { "cmd": "...", "target": "..." }
   */
  _parseResponse(response) {
    let text = response;
    let command = null;

    // Try to find JSON command in response
    const jsonMatch = response.match(/\{[\s\S]*?"cmd"[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        command = JSON.parse(jsonMatch[0]);
        // Remove command from displayed text
        text = response.replace(jsonMatch[0], '').trim();
      } catch (e) {
        // JSON parse failed, treat entire response as text
      }
    }

    return { text, command };
  }
}

export default new LlamaService();
