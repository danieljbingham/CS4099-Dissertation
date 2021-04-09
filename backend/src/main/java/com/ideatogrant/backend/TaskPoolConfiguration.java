package com.ideatogrant.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class TaskPoolConfiguration implements AsyncConfigurer {

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
        System.out.println(threadPoolTaskExecutor.getPoolSize());
        System.out.println(threadPoolTaskExecutor.getCorePoolSize());
        System.out.println(threadPoolTaskExecutor.getMaxPoolSize());
        System.out.println(threadPoolTaskExecutor.getKeepAliveSeconds());

        threadPoolTaskExecutor.setCorePoolSize(10);
        threadPoolTaskExecutor.setMaxPoolSize(20);
        threadPoolTaskExecutor.setAllowCoreThreadTimeOut(true);

        return threadPoolTaskExecutor;
    }
}
