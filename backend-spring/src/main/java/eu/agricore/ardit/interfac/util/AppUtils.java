package eu.agricore.ardit.interfac.util;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

public final class AppUtils {

    public static <T> Page<T> convertToPage(List<T> objectList, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), objectList.size());
        List<T> subList = start >= end ? new ArrayList<>() : objectList.subList(start, end);
        return new PageImpl<>(subList, pageable, objectList.size());
    }
}