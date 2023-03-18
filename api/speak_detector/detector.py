import cv2
import numpy as np

class SD:
    def is_speaking(prev_img, curr_img, debug=False, threshold=1500, width=800, height=800):
        """
        Args:
            prev_img:
            curr_img:
        Returns:
            Bool value if a person is speaking or not
        """
        prev_img = cv2.resize(prev_img, (width, height))
        curr_img = cv2.resize(curr_img, (width, height))
        diff = cv2.absdiff(prev_img, curr_img)
        norm = np.sum(diff) / (width*height) * 100
        if debug:
            print(norm)
        return norm > threshold
