import React from 'react';
import EditorTemplate from 'components/editor/EditorTemplate';
// import EditorHeader from 'components/editor/EditorHeader';
import EditorHeaderContainer from 'containers/editor/EditorHeaderContainer';
// import EditorPane from 'components/editor/EditorPane';
import EditorPaneContainer from 'containers/editor/EditorPaneContainer';
// import PreviewPane from 'components/editor/PreviewPane';
import PreviewPaneContainer from 'containers/editor/PreviewPaneContainer';

const EditorPage = () => {
    return (
        <EditorTemplate
            header={<EditorHeaderContainer />}
            editor={<EditorPaneContainer />}
            preview={<PreviewPaneContainer />}
        />
    )
}

export default EditorPage;