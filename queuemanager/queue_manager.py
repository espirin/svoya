from enum import Enum
from typing import List, Dict

import rq
from redis import Redis
from rq import cancel_job
from rq.command import send_stop_job_command
from rq.job import Job


class JobState(Enum):
    FAILED = "failed"
    RUNNING = "running"
    QUEUED = "queued"


class QueueManager:
    """QueueManager inits, manages and communicates with redis queues."""

    def __init__(self):
        self.image_queue = rq.Queue("image_queue", connection=Redis())
        self.queues: List[rq.Queue] = [self.image_queue]
        self.clean_previous_jobs()

    def clean_previous_jobs(self):
        for queue in self.queues:
            for job_id in queue.started_job_registry.get_job_ids():
                queue.started_job_registry.remove(job_id)

    @staticmethod
    def stop_job(job_id: str):
        send_stop_job_command(Redis(), job_id)

    @staticmethod
    def cancel_job(job_id: str):
        cancel_job(job_id, Redis())

    @staticmethod
    def clear_exceptions(queues: List[rq.Queue]):
        for queue in queues:
            for job_id in queue.failed_job_registry.get_job_ids():
                queue.failed_job_registry.remove(job_id)

    @staticmethod
    def get_jobs_status(queues: List[rq.Queue], sort=True):
        def create_job_status(job_id_: str, state_: JobState, text_: str, queue_name_: str) -> Dict[str, str]:
            return {"job_id": job_id_, "text": text_, "state": state_.value, "queue_name": queue_name_}

        jobs = []
        for queue in queues:
            for job in queue.jobs:
                jobs.append(create_job_status(job.id, JobState.QUEUED, "queued", queue.name))
            for job_id in queue.started_job_registry.get_job_ids():
                job = Job.fetch(job_id, connection=Redis())
                if 'message' in job.meta:
                    jobs.append(create_job_status(job.id, JobState.RUNNING, job.meta['message'], queue.name))
            for job_id in queue.failed_job_registry.get_job_ids():
                job = Job.fetch(job_id, connection=Redis())
                jobs.append(create_job_status(job.id, JobState.FAILED, str(job.__dict__['exc_info']), queue.name))

        if sort:
            jobs.sort(key=lambda x: x['job_id'], reverse=True)
        return jobs
