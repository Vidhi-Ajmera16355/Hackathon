import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { FolderTree, ListTodo, ChevronDown, ChevronRight, FileCode, Code, Eye } from 'lucide-react';
import Editor from "@monaco-editor/react";

interface LocationState {
  prompt: string;
}

interface File {
  name: string;
  type: 'file' | 'folder';
  children?: File[];
  content?: string;
}

const BuilderPage = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  if (!state?.prompt) {
    return <Navigate to="/" replace />;
  }

  // Mock steps for demonstration
  const steps = [
    'Create initial files',
    'Update package.json',
    'Install dependencies',
    'Create src/types/index.ts',
    'Create src/components/FileExplorer.tsx',
    'Create src/components/Sidebar.tsx',
    'Create src/pages/Home.tsx',
    'Create src/pages/Builder.tsx'
  ];

  // Mock file contents
  const mockContents: Record<string, string> = {
    'index.ts': '// Type definitions\nexport interface Project {\n  name: string;\n  description: string;\n}',
    'FileExplorer.tsx': 'import React from "react";\n\nexport const FileExplorer = () => {\n  return <div>File Explorer</div>;\n};',
    'Sidebar.tsx': 'import React from "react";\n\nexport const Sidebar = () => {\n  return <div>Sidebar</div>;\n};',
    'Home.tsx': 'import React from "react";\n\nexport const Home = () => {\n  return <div>Home Page</div>;\n};',
    'Builder.tsx': 'import React from "react";\n\nexport const Builder = () => {\n  return <div>Builder Page</div>;\n};'
  };

  // Updated file structure to match the image
  const files = [
    {
      name: 'src', type: 'folder', children: [
        {
          name: 'types', type: 'folder', children: [
            { name: 'index.ts', type: 'file', content: mockContents['index.ts'] }
          ]
        },
        {
          name: 'components', type: 'folder', children: [
            { name: 'FileExplorer.tsx', type: 'file', content: mockContents['FileExplorer.tsx'] },
            { name: 'Sidebar.tsx', type: 'file', content: mockContents['Sidebar.tsx'] }
          ]
        },
        {
          name: 'pages', type: 'folder', children: [
            { name: 'Home.tsx', type: 'file', content: mockContents['Home.tsx'] },
            { name: 'Builder.tsx', type: 'file', content: mockContents['Builder.tsx'] }
          ]
        }
      ]
    }
  ];

  const handleFileClick = (fileName: string, content: string = '') => {
    setSelectedFile(fileName);
    setFileContent(content);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Steps sidebar - 25% */}
      <div className="w-1/4 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <ListTodo className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Build Steps</h2>
        </div>
        <div className="space-y-1">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm ${index === 0
                ? 'bg-indigo-900/50 text-indigo-300'
                : 'text-gray-400 hover:bg-gray-700/50'
                }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* File explorer - 25% */}
      <div className="w-1/4 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <FolderTree className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">File Explorer</h2>
        </div>
        <div className="space-y-1">
          {files.map((file, index) => (
            <FileItem
              key={index}
              file={file}
              level={0}
              onFileClick={handleFileClick}
            />
          ))}
        </div>
      </div>

      {/* Code/Preview section - 50% */}
      <div className="w-1/2 bg-gray-900 flex flex-col">
        {/* Tab buttons */}
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'code'
              ? 'text-white border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('code')}
          >
            <Code className="h-4 w-4" />
            Code
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'preview'
              ? 'text-white border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'code' ? (
            selectedFile ? (
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={fileContent}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a file to view its contents
              </div>
            )
          ) : (
            <div className="h-full bg-white">
              <iframe
                src="/preview"
                className="w-full h-full border-0"
                title="Preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FileItem = ({
  file,
  level,
  onFileClick
}: {
  file: File;
  level: number;
  onFileClick: (fileName: string, content?: string) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileClick(file.name, file.content);
    }
  };

  return (
    <div className="space-y-0.5">
      <div
        className={`flex items-center gap-2 p-1.5 rounded hover:bg-gray-700/50 cursor-pointer text-sm`}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={handleClick}
      >
        {file.type === 'folder' ? (
          <>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            <FolderTree className="h-4 w-4 text-indigo-400" />
          </>
        ) : (
          <>
            <span className="w-4" />
            <FileCode className="h-4 w-4 text-blue-400" />
          </>
        )}
        <span className="text-gray-300">{file.name}</span>
      </div>
      {isOpen && file.children && (
        <div className="space-y-0.5">
          {file.children.map((child, index) => (
            <FileItem
              key={index}
              file={child}
              level={level + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuilderPage;
