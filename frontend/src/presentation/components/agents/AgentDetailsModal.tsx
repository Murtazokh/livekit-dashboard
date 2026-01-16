import React from 'react';
import { X, Bot, Brain, Mic, Volume2, MessageSquare } from 'lucide-react';
import type { Agent } from '@/core/domain/Agent';
import { Button, StatusBadge } from '../ui';

interface AgentDetailsModalProps {
  agent: Agent;
  onClose: () => void;
}

/**
 * Modal component to display detailed agent configuration
 */
export const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({ agent, onClose }) => {
  // Parse config if stored as string
  const config = agent.config || (agent.metadata ? tryParseJSON(agent.metadata) : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-elevated border border-border-default rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <Bot className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{agent.name}</h2>
              <p className="text-sm text-text-secondary">Agent Configuration</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary mb-1">Dispatch ID</p>
                <p className="text-sm font-mono text-text-primary">{agent.id}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Room</p>
                <p className="text-sm text-text-primary">{agent.roomName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">State</p>
                <StatusBadge
                  status={agent.state === 'ACTIVE' ? 'success' : 'info'}
                  label={agent.state}
                  showDot
                />
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Type</p>
                <p className="text-sm text-text-primary">{agent.type}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {config?.instructions && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-primary-500" />
                <h3 className="text-sm font-semibold text-text-primary">Instructions</h3>
              </div>
              <div className="bg-surface-base border border-border-default rounded-md p-4">
                <p className="text-sm text-text-primary whitespace-pre-wrap">{config.instructions}</p>
              </div>
            </div>
          )}

          {/* LLM Configuration */}
          {config?.llm && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-primary-500" />
                <h3 className="text-sm font-semibold text-text-primary">Large Language Model (LLM)</h3>
              </div>
              <div className="bg-surface-base border border-border-default rounded-md p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Provider</span>
                  <span className="text-sm font-medium text-text-primary">{config.llm.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Model</span>
                  <span className="text-sm font-mono text-text-primary">{config.llm.model}</span>
                </div>
                {config.llm.temperature !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary">Temperature</span>
                    <span className="text-sm text-text-primary">{config.llm.temperature}</span>
                  </div>
                )}
                {config.llm.maxTokens && (
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary">Max Tokens</span>
                    <span className="text-sm text-text-primary">{config.llm.maxTokens}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STT Configuration */}
          {config?.stt && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mic className="h-4 w-4 text-primary-500" />
                <h3 className="text-sm font-semibold text-text-primary">Speech-to-Text (STT)</h3>
              </div>
              <div className="bg-surface-base border border-border-default rounded-md p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Provider</span>
                  <span className="text-sm font-medium text-text-primary">{config.stt.provider}</span>
                </div>
                {config.stt.model && (
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary">Model</span>
                    <span className="text-sm font-mono text-text-primary">{config.stt.model}</span>
                  </div>
                )}
                {config.stt.language && (
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary">Language</span>
                    <span className="text-sm text-text-primary">{config.stt.language}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TTS Configuration */}
          {config?.tts && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="h-4 w-4 text-primary-500" />
                <h3 className="text-sm font-semibold text-text-primary">Text-to-Speech (TTS)</h3>
              </div>
              <div className="bg-surface-base border border-border-default rounded-md p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Provider</span>
                  <span className="text-sm font-medium text-text-primary">{config.tts.provider}</span>
                </div>
                {config.tts.voice && (
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary">Voice</span>
                    <span className="text-sm text-text-primary">{config.tts.voice}</span>
                  </div>
                )}
                {config.tts.speed !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary">Speed</span>
                    <span className="text-sm text-text-primary">{config.tts.speed}x</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw Metadata (if no parsed config) */}
          {!config && agent.metadata && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Raw Metadata</h3>
              <div className="bg-surface-base border border-border-default rounded-md p-4">
                <pre className="text-xs font-mono text-text-secondary overflow-x-auto">
                  {agent.metadata}
                </pre>
              </div>
            </div>
          )}

          {/* No Configuration */}
          {!config && !agent.metadata && (
            <div className="text-center py-8">
              <p className="text-sm text-text-secondary">No configuration available for this agent</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border-default">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to safely parse JSON
function tryParseJSON(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
