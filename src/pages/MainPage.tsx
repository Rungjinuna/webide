import Editor from '@/webIDE/components/Editor';
import FileTree from '@/webIDE/components/FileTree';

const MainPage = () => {
  return (
    <div className='flex'>
      <aside className='w-1/4'>
        <FileTree />
      </aside>
      <div className='w-3/4'>
        <Editor />
      </div>
    </div>
  );
};

export default MainPage;
