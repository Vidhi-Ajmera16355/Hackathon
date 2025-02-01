import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FolderTree, ChevronLeft, PlayCircle, ChevronDown, ChevronRight, FileCode, Code2, Eye } from 'lucide-react';
import Editor from "@monaco-editor/react";

interface Step {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

type Tab = 'code' | 'preview';

const BuilderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt } = location.state || { prompt: '' };
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('code');

  // Example file structure - would be dynamic in real app
  const fileStructure: FileNode = {
    name: '/',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'components',
            type: 'folder',
            children: [
              {
                name: 'Header.tsx',
                type: 'file',
                content: 'export default function Header() {\n  return <header>Header Component</header>;\n}'
              },
              {
                name: 'Footer.tsx',
                type: 'file',
                content: 'export default function Footer() {\n  return <footer>Footer Component</footer>;\n}'
              }
            ]
          },
          {
            name: 'App.tsx',
            type: 'file',
            content: 'import React from "react";\n\nexport default function App() {\n  return <div>App Component</div>;\n}'
          }
        ]
      }
    ]
  };



  const steps: Step[] = [
   
  ];

  async function init()

  useEffect(()=>{
    init();
  }, [])

  const getStatusColor = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFileTree = (node: FileNode, path: string = '') => {
    const currentPath = `${path}/${node.name}`;
    const isExpanded = expandedFolders.has(currentPath);

    if (node.type === 'folder') {
      return (
        <div key={currentPath}>
          <div
            className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
            onClick={() => toggleFolder(currentPath)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
            )}
            <span className="text-gray-300">📁 {node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div className="ml-4">
              {node.children.map(child => renderFileTree(child, currentPath))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={currentPath}
        className={`flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer ${selectedFile === node ? 'bg-gray-800' : ''
          }`}
        onClick={() => setSelectedFile(node)}
      >
        <FileCode className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-gray-300">{node.name}</span>
      </div>
    );
  };

  const handlePreviewClick = () => {
    // Open preview in a new tab
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module">
              ${selectedFile?.content || ''}
            </script>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gray-900 flex overflow-hidden">
      {/* Left Sidebar - Steps */}
      <div className="w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-300 hover:text-white mb-8"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-2">Your Prompt:</h2>
            <p className="text-gray-400 text-sm">{prompt}</p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="relative">
                <div className={`absolute left-0 top-0 w-2 h-full ${getStatusColor(step.status)} rounded-full`} />
                <div className="pl-6">
                  <h3 className="font-medium text-white">{step.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FolderTree className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Project Files</h2>
            </div>
            <div className="flex space-x-2">
              <button
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'code'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                onClick={() => setActiveTab('code')}
              >
                <Code2 className="h-5 w-5 mr-2" />
                Code
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                onClick={() => {
                  setActiveTab('preview');
                  handlePreviewClick();
                }}
              >
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree */}
          <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              {renderFileTree(fileStructure)}
            </div>
          </div>

          {/* Editor/Preview Area */}
          <div className="w-2/3 overflow-hidden">
            {selectedFile ? (
              activeTab === 'code' ? (
                <Editor
                  height="100%"
                  defaultLanguage="typescript"
                  value={selectedFile?.content || ''} // ✅ This ensures the content updates when selectedFile changes
                  theme="vs-dark"
                  onChange={(newValue) => {
                    setSelectedFile((prev) => prev ? { ...prev, content: newValue || '' } : null);
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    readOnly: false,
                    wordWrap: 'on'
                  }}
                />

              ) : null
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a file to view its contents
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;