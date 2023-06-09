import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addComment } from '../../actions/post';
import { connect } from 'react-redux';
const CommentForm = ({addComment,postId}) => {
  const [text,setText]=useState('')
  return  <div  className='container'>
    
    
  <div className='bg-primary p'>
    <h3>Leave a comment...</h3>
  </div>
  <form
    className='form my-1'
    onSubmit={e => {
      e.preventDefault();
      addComment(postId,{ text });
      setText('');
    }}
  >
    <textarea
      name='text'
      cols='30'
      rows='5'
      placeholder='Create a comment'
      value={text}
      onChange={e => setText(e.target.value)}
      required
    />
    <input type='submit' className='btn btn-dark my-3' value='Submit' />
  </form>
  
</div>;
};

CommentForm.propTypes = {
  addComment:PropTypes.func.isRequired
};

export default connect(null,{addComment})(CommentForm);
